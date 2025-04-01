# 001

> 我来帮您将docker-compose文件中的MySQL配置转换为对应的SQL语句。
>
> 根据docker-compose文件中的配置信息，我们需要：
> 1. 创建数据库 easyswap
> 2. 创建用户 easyuser 并设置密码
> 3. 设置root用户密码
> 4. 使用原生密码认证方式
>
> 以下是对应的SQL语句：
>
> ```sql
> -- 修改root用户密码
> ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'rootpasswd';
> 
> -- 创建数据库
> CREATE DATABASE IF NOT EXISTS easyswap;
> 
> -- 创建用户并设置密码，使用原生密码认证
> CREATE USER 'easyuser'@'localhost' IDENTIFIED WITH mysql_native_password BY 'easypasswd';
> 
> -- 授予该用户对easyswap数据库的所有权限
> GRANT ALL PRIVILEGES ON easyswap.* TO 'easyuser'@'localhost';
> 
> -- 刷新权限
> FLUSH PRIVILEGES;
> ```
>
> 使用说明：
> 1. 请先确保您已经下载并解压了MySQL免安装版
> 2. 初始化MySQL后，使用root用户登录到MySQL
> 3. 然后依次执行上述SQL语句
> 4. 如果您需要从其他机器远程连接，需要将`@'localhost'`改为`@'%'`
>
> 需要注意的是：
> - 以上语句使用了与docker-compose中相同的密码，您可以根据需要修改密码
> - 使用了`mysql_native_password`认证方式，这与docker-compose中的配置保持一致
> - 建议在生产环境中使用更强的密码

