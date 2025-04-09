<h1 align="center" style="color:rgb(0,133,125)">EasySwapSync</h1>

# 000---说明

| 项目         | 内容                |
| ------------ | ------------------- |
| 文档更新时间 | 2025-04-09 20:08:16 |





# 001---准备数据库和redis

## 01---转换

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





## 02---各表结构**分析**

我来分析一下这个SQL文件中的表结构及其作用。这是一个NFT市场的数据库设计，主要针对Sepolia测试网络。以下是各个表的详细分析：

| 表名                                  | 主要作用           | 关键字段说明                                                 |
| ------------------------------------- | ------------------ | ------------------------------------------------------------ |
| `ob_activity_sepolia`                 | 记录NFT市场活动    | - `activity_type`: 活动类型(1-10)<br>- `maker/taker`: 交易双方地址<br>- `collection_address`: NFT集合地址<br>- `token_id`: NFT标识<br>- `price`: 交易价格 |
| `ob_collection_sepolia`               | NFT集合信息        | - `address`: 合约地址<br>- `name/symbol`: 集合名称/标识<br>- `owner_amount`: 持有者数量<br>- `item_amount`: NFT总量<br>- `floor_price`: 地板价 |
| `ob_collection_floor_price_sepolia`   | 记录集合地板价历史 | - `collection_address`: 集合地址<br>- `price`: 地板价<br>- `event_time`: 时间戳 |
| `ob_collection_import_record_sepolia` | 记录集合导入状态   | - `collection_address`: 集合地址<br>- `finished_stage`: 完成阶段(0-2) |
| `ob_global_collection_sepolia`        | 全局集合管理       | - `collection_address`: 集合地址<br>- `token_standard`: 代币标准<br>- `import_status`: 导入状态 |
| `ob_item_sepolia`                     | NFT物品信息        | - `token_id`: NFT标识<br>- `owner`: 拥有者<br>- `list_price`: 上架价格<br>- `sale_price`: 销售价格 |
| `ob_item_external_sepolia`            | NFT外部资源信息    | - `meta_data_uri`: 元数据地址<br>- `image_uri`: 图片地址<br>- `video_uri`: 视频地址 |
| `ob_item_trait_sepolia`               | NFT属性特征        | - `trait`: 属性名称<br>- `trait_value`: 属性值               |
| `ob_order_sepolia`                    | 订单信息           | - `order_id`: 订单哈希<br>- `order_status`: 订单状态<br>- `price`: 价格<br>- `maker/taker`: 交易双方 |
| `ob_user`                             | 用户信息           | - `address`: 用户地址<br>- `is_allowed`: 是否允许访问        |
| `ob_indexed_status`                   | 区块同步状态       | - `chain_id`: 链ID<br>- `last_indexed_block`: 最后同步区块<br>- `index_type`: 索引类型 |

这个数据库设计主要服务于NFT市场的以下功能：
1. NFT交易记录追踪
2. 集合信息管理
3. 用户资产管理
4. 订单管理
5. 市场数据统计
6. 区块同步状态监控

所有表都采用了`utf8mb4_general_ci`字符集，支持完整的Unicode字符集，适合存储NFT相关的各种数据。

---







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





# 003---入口代码分析

## 01---入口`main.go`&`root.go`

> 我来分析一下 `root.go` 文件的内容和功能：
>
> 这是一个使用 Cobra 命令行框架的 Go 程序入口文件，主要功能如下：
>
> 1. **包和依赖导入**：
> ```go
> import (
>     "fmt"
>     "os"
>     "strings"
>     "github.com/mitchellh/go-homedir"
>     "github.com/spf13/cobra"
>     "github.com/spf13/viper"
> )
> ```
> - 使用了 `cobra` 作为命令行框架
> - 使用 `viper` 进行配置管理
> - 使用 `go-homedir` 处理用户主目录路径
>
> 2. **根命令定义**：
> ```go
> var rootCmd = &cobra.Command{
>     Use:   "sync",
>     Short: "root server.",
>     Long:  `root server.`,
> }
> ```
> - 定义了根命令 `sync`
> - 提供了简短和详细的命令描述
>
> 3. **配置管理**：
> ```go
> var cfgFile string
> ```
> - 定义了配置文件路径变量
>
> 4. **初始化函数**：
> ```go
> func init() {
>     cobra.OnInitialize(initConfig)
>     flags := rootCmd.PersistentFlags()
>     flags.StringVarP(&cfgFile, "config", "c", "./config/config_import.toml", "config file (default is $HOME/.config_import.toml)")
> }
> ```
> - 设置了配置初始化回调
> - 定义了命令行参数 `-c` 或 `--config` 用于指定配置文件路径
> - 默认配置文件路径为 `./config/config_import.toml`
>
> 5. **配置初始化函数**：
> ```go
> func initConfig() {
>     // 配置文件处理逻辑
>     viper.SetConfigType("toml")
>     viper.SetEnvPrefix("EasySwap")
>     // ... 其他配置初始化
> }
> ```
> - 使用 Viper 进行配置管理
> - 支持 TOML 格式配置文件
> - 设置了环境变量前缀为 "EasySwap"
> - 支持环境变量覆盖配置（使用点号转下划线的格式）
>
> 6. **命令执行函数**：
> ```go
> func Execute() {
>     if err := rootCmd.Execute(); err != nil {
>         fmt.Println(err)
>         os.Exit(1)
>     }
>     fmt.Println("cfgFile=", cfgFile)
> }
> ```
> - 执行根命令
> - 处理执行错误
> - 输出配置文件路径
>
> 这个文件的主要特点是：
> 1. 使用了 Cobra 框架构建命令行应用
> 2. 集成了 Viper 进行配置管理
> 3. 支持通过命令行参数和环境变量配置
> 4. 提供了灵活的配置文件路径设置
> 5. 使用了 TOML 作为配置文件格式
>
> 这是一个典型的 Go 命令行应用程序的入口文件，提供了良好的配置管理和命令行参数处理能力。





## 02---`cobra`（命令行工具库）(docker)(**事实标准**)

> # github.com/spf13/cobra 详解
>
> `github.com/spf13/cobra` 是 Go 语言中一个非常流行的命令行工具库，用于构建强大的命令行应用程序。它被许多知名项目使用，如 Kubernetes、Docker、Hugo 等。
>
> ## 主要特性
>
> 1. **简单易用的 CLI 应用程序创建**
> 2. **支持子命令的嵌套**
> 3. **自动生成帮助信息和用法提示**
> 4. **支持全局、本地和级联标志**
> 5. **智能建议（当用户输入错误命令时）**
> 6. **自动生成 shell 自动补全（bash、zsh、fish、powershell）**
> 7. **自动生成 man 手册页**
>
> ## 核心概念
>
> ### 1. Command (命令)
>
> `cobra.Command` 是 Cobra 的核心结构体，代表一个命令或子命令。每个 CLI 应用程序至少有一个根命令。
>
> ```go
> var rootCmd = &cobra.Command{
>     Use:   "myapp",
>     Short: "A brief description of your application",
>     Long: `A longer description that spans multiple lines and likely contains
> examples and usage of using your application.`,
>     Run: func(cmd *cobra.Command, args []string) {
>         // 命令执行时的逻辑
>     },
> }
> ```
>
> ### 2. Flags (标志)
>
> Cobra 支持两种类型的标志：
>
> • **持久标志 (Persistent Flags)**：对所有命令及其子命令都可用
> • **本地标志 (Local Flags)**：仅对特定命令可用
>
> ```go
> // 持久标志
> rootCmd.PersistentFlags().StringVarP(&cfgFile, "config", "c", "", "config file")
> 
> // 本地标志
> serveCmd.Flags().IntP("port", "p", 8080, "Port to run server on")
> ```
>
> ## 基本使用示例
>
> ### 1. 初始化 Cobra 应用
>
> ```go
> package main
> 
> import (
>     "fmt"
>     "os"
>     
>     "github.com/spf13/cobra"
> )
> 
> func main() {
>     var rootCmd = &cobra.Command{
>         Use:   "greet",
>         Short: "A simple greeting application",
>         Run: func(cmd *cobra.Command, args []string) {
>             fmt.Println("Hello, World!")
>         },
>     }
>     
>     if err := rootCmd.Execute(); err != nil {
>         fmt.Println(err)
>         os.Exit(1)
>     }
> }
> ```
>
> ### 2. 添加子命令
>
> ```go
> func init() {
>     var versionCmd = &cobra.Command{
>         Use:   "version",
>         Short: "Print the version number",
>         Run: func(cmd *cobra.Command, args []string) {
>             fmt.Println("v1.0.0")
>         },
>     }
>     
>     rootCmd.AddCommand(versionCmd)
> }
> ```
>
> ### 3. 使用标志
>
> ```go
> func init() {
>     var name string
>     var age int
>     
>     var greetCmd = &cobra.Command{
>         Use:   "greet",
>         Short: "Greet someone",
>         Run: func(cmd *cobra.Command, args []string) {
>             fmt.Printf("Hello, %s! You are %d years old.\n", name, age)
>         },
>     }
>     
>     greetCmd.Flags().StringVarP(&name, "name", "n", "", "Name to greet")
>     greetCmd.Flags().IntVarP(&age, "age", "a", 0, "Age of the person")
>     
>     rootCmd.AddCommand(greetCmd)
> }
> ```
>
> ## 高级特性
>
> ### 1. 参数验证
>
> ```go
> var cmd = &cobra.Command{
>     Use:   "print [NAME]",
>     Short: "Print the given name",
>     Args:  cobra.ExactArgs(1), // 确保有且只有一个参数
>     Run: func(cmd *cobra.Command, args []string) {
>         fmt.Println("Name:", args[0])
>     },
> }
> ```
>
> ### 2. 钩子函数
>
> ```go
> var cmd = &cobra.Command{
>     Use:   "example",
>     Short: "Example command",
>     PersistentPreRun: func(cmd *cobra.Command, args []string) {
>         // 在执行命令前运行
>     },
>     PreRun: func(cmd *cobra.Command, args []string) {
>         // 在执行命令前运行（在 PersistentPreRun 之后）
>     },
>     Run: func(cmd *cobra.Command, args []string) {
>         // 主逻辑
>     },
>     PostRun: func(cmd *cobra.Command, args []string) {
>         // 在执行命令后运行
>     },
>     PersistentPostRun: func(cmd *cobra.Command, args []string) {
>         // 在执行命令后运行（在 PostRun 之后）
>     },
> }
> ```
>
> ### 3. 自动生成文档
>
> Cobra 可以自动生成 Markdown、man 手册页等文档：
>
> ```go
> cmd := &cobra.Command{
>     Use:   "docs",
>     Short: "Generate documentation",
>     Run: func(cmd *cobra.Command, args []string) {
>         // 生成 markdown 文档
>         err := doc.GenMarkdownTree(rootCmd, "./docs")
>         if err != nil {
>             log.Fatal(err)
>         }
>     },
> }
> ```
>
> ## 实际应用建议
>
> 1. **项目结构**：对于大型 CLI 应用，建议将命令组织在不同的文件中
> 2. **配置管理**：可以结合 `github.com/spf13/viper` 进行配置管理
> 3. **错误处理**：使用 `cmd.SilenceErrors = true` 和 `cmd.SilenceUsage = true` 控制错误输出
> 4. **测试**：Cobra 命令可以方便地进行单元测试
>
> ## 总结
>
> `github.com/spf13/cobra` 提供了构建强大 CLI 应用程序所需的所有功能，从简单的单命令工具到复杂的多级子命令系统都能胜任。它的设计既灵活又强大，是 Go 语言生态中 CLI 工具开发的事实标准。



## 03---配置文件加载机制

> 让我解释一下 `viper.SetConfigFile(cfgFile)` 和 `config_import.toml.template` 的关系：
>
> 1. **配置文件加载机制**：
> - `viper.SetConfigFile(cfgFile)` 是从命令行参数 `-c` 或 `--config` 指定的路径加载配置文件
> - 默认路径是 `./config/config_import.toml`
> - 注意：这里加载的是 `.toml` 文件，而不是 `.toml.template` 文件
>
> 2. **模板文件的作用**：
> - `config_import.toml.template` 是一个模板文件，它展示了配置文件的格式和结构
> - 这个模板文件通常用于：
>   - 作为配置文件的示例
>   - 帮助用户了解需要配置哪些参数
>   - 作为创建实际配置文件的参考
>
> 3. **实际使用流程**：
> ```go
> // 默认配置文件路径
> flags.StringVarP(&cfgFile, "config", "c", "./config/config_import.toml", "config file")
> ```
> - 用户需要：
>   1. 复制 `config_import.toml.template` 为 `config_import.toml`
>   2. 根据实际环境修改 `config_import.toml` 中的配置值
>   3. 程序会加载修改后的 `config_import.toml` 文件
>
> 4. **配置示例**：
> 从模板文件可以看到需要配置的内容包括：
> - 项目配置（project_cfg）
> - 监控配置（monitor）
> - 日志配置（log）
> - 数据库配置（db）
> - Redis配置（kv）
> - Ankr配置（ankr_cfg）
> - 链配置（chain_cfg）
> - 合约配置（contract_cfg）
>
> 所以，`viper.SetConfigFile(cfgFile)` 不是直接加载模板文件，而是加载用户根据模板创建的实际配置文件。这是一个常见的配置管理实践，通过模板文件指导用户创建正确的配置文件。



## 04---看使用示例**才好理解**

> 好的，让我详细解释这个配置加载机制：
>
> 1. **命令行参数定义**：
> ```go
> func init() {
>     flags := rootCmd.PersistentFlags()
>     flags.StringVarP(&cfgFile, "config", "c", "./config/config_import.toml", "config file (default is $HOME/.config_import.toml)")
> }
> ```
> 这里使用了 Cobra 框架的 `StringVarP` 方法定义了一个命令行参数：
> - 参数名：`config`（长格式）
> - 简写：`c`（短格式）
> - 默认值：`./config/config_import.toml`
> - 描述：`config file (default is $HOME/.config_import.toml)`
>
> 2. **配置加载流程**：
> ```go
> func initConfig() {
>     if cfgFile != "" {
>         // 从flag中获取配置文件
>         viper.SetConfigFile(cfgFile)
>     } else {
>         // 主目录 /Users/$HOME$
>         home, err := homedir.Dir()
>         if err != nil {
>             fmt.Println(err)
>             os.Exit(1)
>         }
> 
>         // 从主目录下搜索后缀名为 ".toml" 文件
>         viper.AddConfigPath(home)
>         viper.SetConfigName("config_import")
>     }
>     // ... 其他配置初始化
> }
> ```
>
> 3. **使用方式**：
> 用户可以通过以下方式指定配置文件：
>
> ```bash
> # 方式1：使用长格式参数
> ./sync --config /path/to/your/config.toml
> 
> # 方式2：使用短格式参数
> ./sync -c /path/to/your/config.toml
> 
> # 方式3：不指定参数，使用默认路径
> ./sync  # 将使用 ./config/config_import.toml
> ```
>
> 4. **配置优先级**：
> - 如果通过命令行指定了配置文件（`-c` 或 `--config`），则使用指定的文件
> - 如果没有指定，则使用默认路径 `./config/config_import.toml`
> - 如果默认路径也不存在，则会在用户主目录下查找 `config_import.toml` 文件
>
> 5. **实际示例**：
> ```bash
> # 假设我们有一个自定义配置文件
> ./sync -c ./my_custom_config.toml
> 
> # 或者使用默认配置
> ./sync
> ```
>
> 6. **错误处理**：
> ```go
> if err := viper.ReadInConfig(); err == nil {
>     fmt.Println("Using config file:", viper.ConfigFileUsed())
> } else {
>     panic(err)
> }
> ```
> - 如果配置文件加载成功，会打印使用的配置文件路径
> - 如果加载失败，程序会 panic 并退出
>
> 这种设计提供了灵活的配置管理方式：
> - 支持通过命令行参数指定配置文件
> - 提供了默认配置路径
> - 支持环境变量覆盖配置
> - 有清晰的错误处理机制
>
> 这种模式在 Go 项目中很常见，它允许用户根据不同的环境（开发、测试、生产）使用不同的配置文件，而不需要修改代码。





## 05---`func init()`的执行时机

> 让我解释一下 Go 语言中 `init()` 函数的执行时机：
>
> 1. **基本执行顺序**：
> ```go
> // 包级别变量初始化
> var cfgFile string
> 
> // init() 函数
> func init() {
>     cobra.OnInitialize(initConfig)
>     flags := rootCmd.PersistentFlags()
>     flags.StringVarP(&cfgFile, "config", "c", "./config/config_import.toml", "config file")
> }
> 
> // main() 函数
> func main() {
>     cmd.Execute()
> }
> ```
>
> 2. **执行时机**：
> - `init()` 函数在包被导入时自动执行
> - 执行顺序：
>   1. 包级别变量初始化
>   2. `init()` 函数执行
>   3. `main()` 函数执行
>
> 3. **在 Cobra 中的特殊处理**：
> ```go
> func init() {
>     // 设置initConfig在调用rootCmd的Execute()方法时运行
>     cobra.OnInitialize(initConfig)
>     // ...
> }
> ```
> - `cobra.OnInitialize(initConfig)` 注册了一个回调函数
> - 这个回调函数会在 `rootCmd.Execute()` 被调用时执行
> - 这意味着 `initConfig()` 实际上是在 `main()` 函数执行后才被调用的
>
> 4. **完整的执行流程**：
> ```go
> // 1. 包被导入时
> var cfgFile string  // 变量初始化
> 
> // 2. init() 执行
> func init() {
>     cobra.OnInitialize(initConfig)  // 注册回调
>     // 设置命令行参数
> }
> 
> // 3. main() 执行
> func main() {
>     cmd.Execute()  // 执行命令
> }
> 
> // 4. Execute() 执行时
> func Execute() {
>     if err := rootCmd.Execute(); err != nil {
>         // ...
>     }
>     // 此时会触发之前注册的 initConfig 回调
> }
> ```
>
> 5. **重要特点**：
> - `init()` 函数在程序启动时自动执行
> - 每个包可以有多个 `init()` 函数
> - 同一个包中的多个 `init()` 函数按声明顺序执行
> - 不同包之间的 `init()` 函数执行顺序取决于包的导入顺序
> - `init()` 函数不能被显式调用
>
> 6. **在 Cobra 应用中的实际应用**：
> ```go
> // 1. 初始化阶段
> func init() {
>     // 设置命令行参数
>     // 注册配置初始化回调
> }
> 
> // 2. 执行阶段
> func Execute() {
>     // 执行命令时触发配置初始化
>     // 处理命令行参数
> }
> ```
>
> 这种设计模式的优势：
> - 实现了配置的延迟初始化
> - 确保配置在命令执行前被正确加载
> - 提供了灵活的配置管理机制
> - 支持通过命令行参数覆盖默认配置
>
> 所以在这个项目中，`init()` 函数主要用于：
> 1. 设置命令行参数
> 2. 注册配置初始化回调
> 3. 为后续的命令执行做准备



## 06---再讲解`daemon.go`

> 我来为您详细讲解 `daemon.go` 这个文件。这是一个使用 Go 语言编写的守护进程程序，主要用于同步 EasySwap 订单信息。让我为您分析其主要功能和结构：
>
> 1. **基本结构**：
> - 文件位于 `practical/EasySwapSync/cmd/daemon.go`
> - 使用 `cobra` 命令行框架
> - 实现了 `DaemonCmd` 命令，用于启动同步服务
>
> 2. **主要功能**：
> - 同步 EasySwap 订单信息
> - 支持优雅退出
> - 包含性能监控（pprof）功能
> - 使用 zap 日志库进行日志记录
>
> 3. **核心代码分析**：
>
> ```go
> var DaemonCmd = &cobra.Command{
>     Use:   "daemon",
>     Short: "sync easy swap order info.",
>     Long:  "sync easy swap order info.",
>     Run: func(cmd *cobra.Command, args []string) {
>         // 初始化上下文和等待组
>         wg := &sync.WaitGroup{}
>         wg.Add(1)
>         ctx := context.Background()
>         ctx, cancel := context.WithCancel(ctx)
> ```
>
> 4. **主要流程**：
> - 初始化配置和日志系统
> - 创建并启动同步服务
> - 处理系统信号（SIGINT, SIGTERM）
> - 支持优雅退出
> - 可选开启性能监控（pprof）
>
> 5. **关键特性**：
> - 使用 `context` 进行上下文管理
> - 使用 `sync.WaitGroup` 进行并发控制
> - 实现了优雅退出机制
> - 支持配置文件解析
> - 集成了性能监控功能
>
> 6. **错误处理**：
> - 配置解析错误处理
> - 日志初始化错误处理
> - 服务启动错误处理
> - 系统信号处理
>
> 7. **监控功能**：
> ```go
> if cfg.Monitor.PprofEnable {
>     http.ListenAndServe(fmt.Sprintf("0.0.0.0:%d", cfg.Monitor.PprofPort), nil)
> }
> ```
>
> 8. **信号处理**：
> ```go
> onSignal := make(chan os.Signal)
> signal.Notify(onSignal, syscall.SIGINT, syscall.SIGTERM)
> ```
>
> 这个守护进程程序的设计非常规范，包含了：
> - 良好的错误处理机制
> - 完善的日志系统
> - 优雅的退出机制
> - 性能监控支持
> - 并发控制
>
> 建议在使用时注意：
> 1. 确保配置文件正确设置
> 2. 合理配置日志级别
> 3. 根据需求开启性能监控
> 4. 注意系统资源的合理使用
>
> 这个程序是 EasySwap 项目的重要组成部分，负责订单信息的同步工作，对于整个系统的稳定运行至关重要。





## 05---定时任务如何触发

> 让我帮您查找定时任务相关的代码。首先我会搜索一下代码库中与定时任务相关的内容。
>
>
> Search files...
> 让我帮您分析一下定时任务的相关内容：
>
> 1. 定时任务的主要实现位置：
> - 在 `practical/EasySwapSync/service/orderbookindexer/service.go` 中有一个 `UpKeepingCollectionFloorChangeLoop` 函数，这是一个定时任务，用于维护NFT集合的地板价变化。
> - 在 `practical/EasySwapBase/ordermanager/listcount.go` 中有一个 `listCountProcess` 函数，用于处理和维护NFT集合的上架数量统计。
> - 在 `practical/EasySwapBase/ordermanager/expiredorder.go` 中有一个 `orderExpiryProcess` 函数，用于处理订单过期的逻辑。
>
> 2. 定时任务的启动方式：
> - 这些定时任务是通过 `practical/EasySwapSync/cmd/daemon.go` 中的 `DaemonCmd` 命令启动的。
> - 具体启动流程：
>   1. 通过 `service.New(ctx, cfg)` 初始化服务
>   2. 调用 `s.Start()` 启动服务
>   3. 服务启动时会自动启动这些定时任务
>
> 3. 主要定时任务的功能：
> - `UpKeepingCollectionFloorChangeLoop`: 
>   - 使用 `time.NewTicker` 创建定时器
>   - 每天执行一次删除过期地板价记录
>   - 每 `MaxCollectionFloorTimeDifference` 秒更新一次地板价
>
> - `listCountProcess`:
>   - 每分钟执行一次更新
>   - 统计和维护NFT集合的上架数量
>   - 将统计结果缓存到Redis
>
> - `orderExpiryProcess`:
>   - 每秒检查一次时间轮
>   - 处理到期的订单
>   - 更新订单状态和地板价
>
> 4. 配置相关：
> - 定时任务的配置可以在 `practical/EasySwapSync/config/config_import.toml.template` 中找到
> - 包括数据库连接、Redis配置、链配置等
>
> 要运行这些定时任务，您需要：
> 1. 确保配置文件正确（`config_import.toml`）
> 2. 运行以下命令：
> ```bash
> cd practical/EasySwapSync
> go run main.go daemon -c "./config/config_import.toml"
> ```
>
> 或者使用 Makefile 中的命令：
> ```bash
> cd practical/EasySwapSync
> make run
> ```
>
> 这些定时任务会在后台持续运行，直到收到终止信号（SIGINT 或 SIGTERM）。



# 04---处理toml

拷贝"config_import.toml.template"到同级目录并重命名"config_import.toml",修改属性：

```toml
dex_address = "0x5560e1c2E0260c2274e400d80C30CDC4B92dC8ac" # undeploy
```

value按照实际部署的地址值填写。这里填的是视频展示的已部署地址；



还要改：

```toml
[ankr_cfg]
api_key=""
https_url="https://rpc.ankr.com/eth_sepolia"
#https_url="https://rpc.ankr.com/optimism"
```

这里是出现报错后问AI的答案：

> 是的，Ankr 和 Infura 都是区块链基础设施服务提供商，它们提供类似的服务，但有一些区别：
>
> 1. 共同点：
>    - 都提供区块链节点服务（RPC节点）
>    - 都支持多个区块链网络（如以太坊主网、测试网等）
>    - 都提供 API 接口供开发者使用
>    - 都有免费和付费套餐
>
> 2. 主要区别：
>    - **网络覆盖**：
>      - Infura：主要专注于以太坊生态
>      - Ankr：支持更多区块链网络，包括以太坊、BSC、Polygon、Avalanche 等
>
>    - **服务特点**：
>      - Infura：更专注于企业级服务，稳定性较好
>      - Ankr：提供更多样化的服务，包括节点即服务（NaaS）、质押服务等
>
>    - **免费额度**：
>      - Infura：每天 100,000 次请求
>      - Ankr：每天 250,000 次请求
>
>    - **API 访问方式**：
>      - Infura：使用项目 ID 作为认证
>      - Ankr：使用 API 密钥作为认证
>
> 3. 使用建议：
>    - 如果主要开发以太坊应用，Infura 是个不错的选择
>    - 如果需要支持多个区块链网络，Ankr 可能更适合
>    - 对于测试环境，两者都可以使用，选择哪个主要看个人偏好和项目需求
>
> 在我们的项目中，由于使用的是 Sepolia 测试网，两者都可以使用。如果你已经有 Infura 的账号和项目 ID，我建议使用 Infura，因为配置更简单，而且免费额度对于测试环境来说已经足够了。
>
> 需要我帮你修改配置文件使用 Infura 吗？



因此**改为**我在用的infura：

```toml
[ankr_cfg]
api_key="你的Infura项目ID"
https_url="https://sepolia.infura.io/v3/你的Infura项目ID"
```



