<h1 align="center" style="color:rgb(0,133,125)">EasySwapSync</h1>

# 000---说明

| 项目         | 内容                |
| ------------ | ------------------- |
| 文档更新时间 | 2025-04-09 20:08:16 |





# 001---准备数据库和redis

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





# 002---如何解决导入依赖模块的问题

> 经AI分析：
> 在处理Go模块时，尤其是当多个模块之间存在依赖关系时，以下是一些建议和步骤，可以帮助你在GoLand中更好地管理这些模块：
>
> 1. **本地替换模块路径**：
>    - 在`go.mod`文件中，你可以使用`replace`指令来指定本地路径。例如：
>      ```go
>      replace github.com/ProjectsTask/EasySwapBase => ../EasySwapBase
>      ```
>    - 这条指令告诉Go编译器在本地路径`../EasySwapBase`中查找`EasySwapBase`模块，而不是从远程仓库下载。
>
> 2. **项目目录结构**：
>    
> - 确保你的项目目录结构合理。通常情况下，你不需要将所有模块放在一个名为`ProjectsTask`的目录中。只要`replace`指令正确指向本地路径即可。
>    
> 3. **在GoLand中设置**：
>    - 在GoLand中，确保你的项目设置中包含所有相关模块的路径。你可以通过`File -> Project Structure`来检查和设置模块路径。
>    - 确保GoLand能够识别`go.mod`文件中的`replace`指令，并正确解析本地模块路径。
>
> 4. **处理私有仓库**：
>    
> - 如果`EasySwapBase`是一个私有仓库，确保你有正确的访问权限。你可能需要配置Git凭据以便Go工具链能够访问私有仓库。
>    
> 5. **使用`go mod tidy`**：
>    
>    - 在运行`go mod tidy`之前，确保所有本地模块路径都已正确设置，并且所有依赖项都可以被访问。
>
> 通过这些步骤，你应该能够在GoLand中更好地管理和识别模块之间的依赖关系。如果你仍然遇到问题，可以检查GoLand的日志或Go命令的输出，以获取更多的调试信息。

将代码里面的注释开放：

![image-20250409204956801](https://img.gust.cafe/i/2025/04/09/5721790482019785140-0.webp)

确保有:

```mod
replace github.com/ProjectsTask/EasySwapBase => ../EasySwapBase
```

就能实现导入另一个项目作为依赖模块；此时再执行：

```bash
go mod tidy
```

PS:EasySwapBackend模块同理；