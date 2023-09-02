# Performance test results

Brief description of the used server (choose one): HTTP/1.1

Brief description of your computer: MacBook Pro, Processor: 2,2 GHz 6-Core Intel Core i7, Memory: 16 GB 2400 MHz DDR4

## No database

### Retrieving todos

http_reqs: 147032
http_req_duration - median: 630.75µs
http_req_duration - 99th percentile: 1.32ms

### Posting todos

http_reqs: 120202
http_req_duration - median: 773.84µs
http_req_duration - 99th percentile: 1.64ms

## With database

### Retrieving todos

http_reqs: 848
http_req_duration - median: 118.21ms
http_req_duration - 99th percentile: 449ms

### Posting todos

http_reqs: 2911
http_req_duration - median: 34.27ms
http_req_duration - 99th percentile: 61.99ms

## Reflection

Brief reflection on the results of the tests -- why do you think you saw the results you saw:

The test results show that the JSON API without database has a greater request rate and is considerably faster than the API with Postgresql database, which could be attributed to the slower performance of the relational database structure.
