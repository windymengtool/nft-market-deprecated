<h1 align="center" style="color:rgb(0,133,125)">EasySwapSync</h1>

# 000---说明

| 项目         | 内容                |
| ------------ | ------------------- |
| 文档更新时间 | 2025-04-09 20:08:16 |





# 001---安装依赖

```bash
go mod tidy
```





# 002---准备数据库和redis

分析"docker-compose-arm64.yml"转为win10免安装版mysql和redis的内容：

```sql
-- 修改root用户密码
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'rootpasswd';

-- 创建数据库
CREATE DATABASE IF NOT EXISTS easyswap;

-- 创建用户并设置密码，使用原生密码认证
CREATE USER 'easyuser'@'localhost' IDENTIFIED WITH mysql_native_password BY 'easypasswd';

-- 授予该用户对easyswap数据库的所有权限
GRANT ALL PRIVILEGES ON easyswap.* TO 'easyuser'@'localhost';

-- 刷新权限
FLUSH PRIVILEGES;
```



用navicat在easyswap库中，执行sql文件生成表结构：

```
EasySwapSync/db/migrations/01_create.sql
```

![image-20250409202003260](https://img.gust.cafe/i/2025/04/09/5721783681866013268-0.webp)

