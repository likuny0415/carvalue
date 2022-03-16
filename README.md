# Design

### Features:
1. Build authentication and authorization by using **Hash and Salt**, **cookie-session**.
2. Enable admins check the report and decided whether to pass it.
3. Tie different types of data together with **TypeORM** relationships
4. Use Guards to prevent unauthorized users from gaining access to sensitive data

### Important points:
1. Build authentication and permissions systems from scratch
2. Use Guards to prevent unauthorized users from gaining access to sensitive data
3. Write **End-to-End** and **unit** tests to ensure my code is working

### Problems I met
##### Taks1: Cannot find module Interceptor NestJS
Solution: VsCode auto auto generated import is **relative path** but it should be **absoulte path**


##### Task2: Why interceptor is not work?
Solution: Interceptor runns after Guard in nestjs. So, when we tried 
to add properties to interceptors and pass into decorators, you
need to put interceptor before the Guard. To deal with this problem,
you need to implement Middleware to do this, because the order 
from request to response is req -> middleware -> guard -> interceptor
-> res
