import { Request } from 'express';
import passport, { Profile } from 'passport';
import {
	Strategy as JwtStrategy,
	StrategyOptions,
	VerifiedCallback,
} from 'passport-jwt';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/User-Jwt';
import { GoogleAuth } from '../models/User-Google';
import keys from '../config/dev';
import { UserType } from '../types/UserType';

var cookieExtractor = function (req: Request) {
	var token = null;
	if (req && req.session) token = req.session.id;
	return token;
};

var opts: StrategyOptions = {
	jwtFromRequest: cookieExtractor,
	secretOrKey: process.env.SECRET_KEY,
};

passport.serializeUser((user: any, done: any) => {
	done(null, user.id);
});

passport.deserializeUser((id: any, done: any) => {
	User.findById(id).then((user) => {
		done(null, user);
	});
});

passport.use(
	new JwtStrategy(opts, function (jwt_payload, done: VerifiedCallback) {
		User.findOne({ id: jwt_payload.id }, function (err: any, user: UserType) {
			if (err) {
				return done(err, false);
			}
			if (user) {
				return done(null, user);
			} else {
				return done(null, false);
			}
		});
	})
);

passport.use(
	new GoogleStrategy(
		{
			callbackURL: '/auth/google/callback',
			clientID: keys.googleClientID,
			clientSecret: keys.googleClientSecret,
			proxy: true,
		},
		async (
			accessToken: string,
			refreshToken: string,
			profile: Profile,
			done: any
		) => {
			try {
				const existingUser = await GoogleAuth.findOne({ googleId: profile.id });
				console.log(existingUser);

				if (existingUser) done(null, existingUser);

				if (!profile.emails) {
					done();
				}

				let emailId = profile.emails![0].value;

				const user = await new GoogleAuth({
					googleId: profile.id,
					name: profile.displayName,
					email: emailId,
				}).save();

				done(null, user);
			} catch (err: any) {
				done(err, null);
			}
		}
	)
);
