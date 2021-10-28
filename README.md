# Performance Monitor
A Realtime Dashboard to view metrics of multiple systems CPU, Memory and it's running processes.

## Features:
- System Dashboard to view CPU and Memory consumption
- Process Dashboard to check all the processes running in the system
- CPU and Memory usage visualization of each process
- Stateless Application (non-persistent storage)
- Every connected system is registed to the Database
- Uses Node.js Cluster Module, so every thread in CPU is serving requests.
- Uses Redis caching for Master to know which worker is assigned to which system.
- Support for Cross-Platform

## Tech Stack:
- Node.js (Express)
- MongoDB
- Sockets.io
- Redis
- React.js
- ApexCharts
- Shards (UI)

### Preview:
![System Dashboard](https://raw.githubusercontent.com/shreyasssk/image-reference/master/performance-monitor.gif)
