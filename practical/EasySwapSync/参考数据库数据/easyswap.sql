/*
 Navicat Premium Data Transfer

 Source Server         : LOCALHOST@3306
 Source Server Type    : MySQL
 Source Server Version : 80036
 Source Host           : localhost:3306
 Source Schema         : easyswap

 Target Server Type    : MySQL
 Target Server Version : 80036
 File Encoding         : 65001

 Date: 10/04/2025 00:24:07
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for ob_activity_sepolia
-- ----------------------------
DROP TABLE IF EXISTS `ob_activity_sepolia`;
CREATE TABLE `ob_activity_sepolia`  (
  `id` bigint(0) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `activity_type` tinyint(0) NOT NULL COMMENT '(1:Buy,2:Mint,3:List,4:Cancel Listing,5:Cancel Offer,6.Make Offer,7.Sell,8.Transfer,9.collection-bid,10.item-bid)',
  `maker` varchar(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '对于buy,sell,listing,transfer类型指的是nft流转的起始方，即卖方address。对于其他类型可以理解为发起方，如make offer谁发起的from就是谁的地址',
  `taker` varchar(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '目标方,和maker相对',
  `marketplace_id` tinyint(0) NOT NULL DEFAULT 0,
  `collection_address` varchar(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `token_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `currency_address` varchar(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '1' COMMENT '货币类型(1表示eth)',
  `price` decimal(30, 0) NOT NULL COMMENT 'nft 价格',
  `sell_price` decimal(30, 0) NOT NULL COMMENT '池子相关数据,出售价格',
  `buy_price` decimal(30, 0) NOT NULL COMMENT '池子相关数据,购买价格',
  `block_number` bigint(0) NOT NULL DEFAULT 0 COMMENT '区块号',
  `tx_hash` varchar(66) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '交易事务hash',
  `event_time` bigint(0) NULL DEFAULT NULL COMMENT '链上事件发生的时间',
  `create_time` bigint(0) NULL DEFAULT NULL COMMENT '创建时间',
  `update_time` bigint(0) NULL DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `index_tx_collection_token_type`(`tx_hash`, `collection_address`, `token_id`, `activity_type`) USING BTREE,
  INDEX `index_collection_token_type`(`collection_address`, `token_id`, `activity_type`) USING BTREE,
  INDEX `index_hash_collection_token_type`(`tx_hash`, `collection_address`, `token_id`, `activity_type`) USING BTREE,
  INDEX `index_tx_collection_token_type_time`(`tx_hash`, `collection_address`, `token_id`, `activity_type`, `event_time`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ob_activity_sepolia
-- ----------------------------
INSERT INTO `ob_activity_sepolia` VALUES (1, 3, '0x56E4F8273750577036d6385243aaB6287F280811', '0x0000000000000000000000000000000000000000', 0, '0x8d0FF0aa2585c4cc5Ca17fFcD0b18f005072C29D', '50', '0x0000000000000000000000000000000000000000', 2000000000000000, 0, 0, 7524211, '0x3b061e16b69f8ed5463d1ca973cd1cdaaec50e27ad9d2d6edbe7e1acb6c8f602', 1737273960, 1744215749176, 1744215749176);
INSERT INTO `ob_activity_sepolia` VALUES (2, 3, '0x56E4F8273750577036d6385243aaB6287F280811', '0x0000000000000000000000000000000000000000', 0, '0x8d0FF0aa2585c4cc5Ca17fFcD0b18f005072C29D', '30', '0x0000000000000000000000000000000000000000', 2000000000000000, 0, 0, 7524222, '0x0b3a7a72735effdc66c27e3722aa9c5348a6b01db3c7dfe02b75cac461f98164', 1737274092, 1744215749942, 1744215749942);
INSERT INTO `ob_activity_sepolia` VALUES (3, 3, '0x56E4F8273750577036d6385243aaB6287F280811', '0x0000000000000000000000000000000000000000', 0, '0x8d0FF0aa2585c4cc5Ca17fFcD0b18f005072C29D', '31', '0x0000000000000000000000000000000000000000', 2000000000000000, 0, 0, 7524224, '0xe0e4ef9992d069347cfd17c8362d97ab8237ba14fbda78f820cf4dea1bcf720a', 1737274116, 1744215750715, 1744215750715);
INSERT INTO `ob_activity_sepolia` VALUES (4, 3, '0x56E4F8273750577036d6385243aaB6287F280811', '0x0000000000000000000000000000000000000000', 0, '0x8d0FF0aa2585c4cc5Ca17fFcD0b18f005072C29D', '32', '0x0000000000000000000000000000000000000000', 2000000000000000, 0, 0, 7524225, '0x8d4a1eddd2b01404e20940c52b4e29454b2a06499fa245e43251c17cc28f7a91', 1737274128, 1744215750982, 1744215750982);
INSERT INTO `ob_activity_sepolia` VALUES (5, 3, '0x56E4F8273750577036d6385243aaB6287F280811', '0x0000000000000000000000000000000000000000', 0, '0x8d0FF0aa2585c4cc5Ca17fFcD0b18f005072C29D', '33', '0x0000000000000000000000000000000000000000', 2000000000000000, 0, 0, 7524226, '0x76f152ec2133380263bb7660acd5ef7a1ce9a5efab9afdd8f3a18796d29ae1d8', 1737274140, 1744215751243, 1744215751243);
INSERT INTO `ob_activity_sepolia` VALUES (6, 3, '0x56E4F8273750577036d6385243aaB6287F280811', '0x0000000000000000000000000000000000000000', 0, '0x8d0FF0aa2585c4cc5Ca17fFcD0b18f005072C29D', '34', '0x0000000000000000000000000000000000000000', 2000000000000000, 0, 0, 7524228, '0x72566f6e85d2070715b9242500ffe25a4df18cafc16179f4a24e6c8fed7ac793', 1737274164, 1744215751516, 1744215751516);
INSERT INTO `ob_activity_sepolia` VALUES (7, 3, '0x56E4F8273750577036d6385243aaB6287F280811', '0x0000000000000000000000000000000000000000', 0, '0x8d0FF0aa2585c4cc5Ca17fFcD0b18f005072C29D', '35', '0x0000000000000000000000000000000000000000', 2000000000000000, 0, 0, 7524229, '0x8cd5a48025dc7da2189bed943a98dff1bb4f8f4a59710aac0359bb800eb097d8', 1737274176, 1744215751771, 1744215751771);
INSERT INTO `ob_activity_sepolia` VALUES (8, 3, '0x56E4F8273750577036d6385243aaB6287F280811', '0x0000000000000000000000000000000000000000', 0, '0x8d0FF0aa2585c4cc5Ca17fFcD0b18f005072C29D', '36', '0x0000000000000000000000000000000000000000', 2000000000000000, 0, 0, 7524230, '0x506104ca9920785dd269597591f45044ad28936d7cb4bb7e16746bc645c23d00', 1737274188, 1744215752029, 1744215752029);
INSERT INTO `ob_activity_sepolia` VALUES (9, 3, '0x56E4F8273750577036d6385243aaB6287F280811', '0x0000000000000000000000000000000000000000', 0, '0x8d0FF0aa2585c4cc5Ca17fFcD0b18f005072C29D', '37', '0x0000000000000000000000000000000000000000', 2000000000000000, 0, 0, 7524231, '0x5ee13e77b2db9604df5c3b1ae4f29bec57475db27ab8c81782f08050766e32a5', 1737274200, 1744215752285, 1744215752285);
INSERT INTO `ob_activity_sepolia` VALUES (10, 3, '0x56E4F8273750577036d6385243aaB6287F280811', '0x0000000000000000000000000000000000000000', 0, '0x8d0FF0aa2585c4cc5Ca17fFcD0b18f005072C29D', '38', '0x0000000000000000000000000000000000000000', 2000000000000000, 0, 0, 7524232, '0xf3de3bc139c09e4351f45d0d5ba3c09e2a7258609f83acc3d97f8a0463133f79', 1737274212, 1744215752544, 1744215752544);
INSERT INTO `ob_activity_sepolia` VALUES (11, 3, '0x56E4F8273750577036d6385243aaB6287F280811', '0x0000000000000000000000000000000000000000', 0, '0x8d0FF0aa2585c4cc5Ca17fFcD0b18f005072C29D', '39', '0x0000000000000000000000000000000000000000', 2000000000000000, 0, 0, 7524233, '0x4b10f1777142dccde853816d059fea7e6980b25bf8642348dd41c113a89af567', 1737274224, 1744215752800, 1744215752800);
INSERT INTO `ob_activity_sepolia` VALUES (12, 3, '0x56E4F8273750577036d6385243aaB6287F280811', '0x0000000000000000000000000000000000000000', 0, '0x8d0FF0aa2585c4cc5Ca17fFcD0b18f005072C29D', '40', '0x0000000000000000000000000000000000000000', 2000000000000000, 0, 0, 7524234, '0x567142f8c9f6bd8287b2c0b1715a7ebaf0dc85b0aa1e36829cc67904bcff6345', 1737274236, 1744215753559, 1744215753559);
INSERT INTO `ob_activity_sepolia` VALUES (13, 3, '0x56E4F8273750577036d6385243aaB6287F280811', '0x0000000000000000000000000000000000000000', 0, '0x8d0FF0aa2585c4cc5Ca17fFcD0b18f005072C29D', '41', '0x0000000000000000000000000000000000000000', 2000000000000000, 0, 0, 7524235, '0x92ac3a6198b6a8fa0a064767b97a0a170a835e767a1d43a7cd409ec5a84b6410', 1737274248, 1744215754032, 1744215754032);
INSERT INTO `ob_activity_sepolia` VALUES (14, 3, '0x56E4F8273750577036d6385243aaB6287F280811', '0x0000000000000000000000000000000000000000', 0, '0x8d0FF0aa2585c4cc5Ca17fFcD0b18f005072C29D', '42', '0x0000000000000000000000000000000000000000', 2000000000000000, 0, 0, 7524236, '0x513a54cd32d60afa1d984d7e5efd138bb65c9ea766b634fad7e1cece59ef698a', 1737274260, 1744215754286, 1744215754286);
INSERT INTO `ob_activity_sepolia` VALUES (15, 3, '0x56E4F8273750577036d6385243aaB6287F280811', '0x0000000000000000000000000000000000000000', 0, '0x8d0FF0aa2585c4cc5Ca17fFcD0b18f005072C29D', '43', '0x0000000000000000000000000000000000000000', 2000000000000000, 0, 0, 7524238, '0x1a8f6273128209ec3cf8a04bbb488358d032d6142ab8e7a2f2b5dcbe68df3b9a', 1737274284, 1744215754546, 1744215754546);
INSERT INTO `ob_activity_sepolia` VALUES (16, 3, '0x56E4F8273750577036d6385243aaB6287F280811', '0x0000000000000000000000000000000000000000', 0, '0x8d0FF0aa2585c4cc5Ca17fFcD0b18f005072C29D', '44', '0x0000000000000000000000000000000000000000', 2000000000000000, 0, 0, 7524239, '0x41967084cddeaaad3bd57864b495706e9fc9ac004434664f04148c87b3f57f49', 1737274296, 1744215754803, 1744215754803);
INSERT INTO `ob_activity_sepolia` VALUES (17, 3, '0x56E4F8273750577036d6385243aaB6287F280811', '0x0000000000000000000000000000000000000000', 0, '0x8d0FF0aa2585c4cc5Ca17fFcD0b18f005072C29D', '45', '0x0000000000000000000000000000000000000000', 2000000000000000, 0, 0, 7524240, '0x32e1615fd04ea24740b1a1c20cbd2f6d70defc930acc391f24107cc46cf20ab8', 1737274308, 1744215755058, 1744215755058);
INSERT INTO `ob_activity_sepolia` VALUES (18, 4, '0x56E4F8273750577036d6385243aaB6287F280811', '0x0000000000000000000000000000000000000000', 0, '0x8d0FF0aa2585c4cc5Ca17fFcD0b18f005072C29D', '30', '0x0000000000000000000000000000000000000000', 2000000000000000, 0, 0, 7524248, '0xd6a4d57464811305c2ba6ce8a4353ee03e857ac7aca2289d9349208319d7d75e', 1737274404, 1744215755816, 1744215755816);
INSERT INTO `ob_activity_sepolia` VALUES (19, 4, '0x56E4F8273750577036d6385243aaB6287F280811', '0x0000000000000000000000000000000000000000', 0, '0x8d0FF0aa2585c4cc5Ca17fFcD0b18f005072C29D', '31', '0x0000000000000000000000000000000000000000', 2000000000000000, 0, 0, 7524249, '0x118e08946b010f7ca8be683350f903c8df0c87a468b06bae72d14076ba6bec76', 1737274416, 1744215756076, 1744215756076);
INSERT INTO `ob_activity_sepolia` VALUES (20, 4, '0x56E4F8273750577036d6385243aaB6287F280811', '0x0000000000000000000000000000000000000000', 0, '0x8d0FF0aa2585c4cc5Ca17fFcD0b18f005072C29D', '32', '0x0000000000000000000000000000000000000000', 2000000000000000, 0, 0, 7524249, '0x118e08946b010f7ca8be683350f903c8df0c87a468b06bae72d14076ba6bec76', 1737274416, 1744215756333, 1744215756333);

-- ----------------------------
-- Table structure for ob_collection_floor_price_sepolia
-- ----------------------------
DROP TABLE IF EXISTS `ob_collection_floor_price_sepolia`;
CREATE TABLE `ob_collection_floor_price_sepolia`  (
  `id` bigint(0) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `collection_address` varchar(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '链上合约地址',
  `price` decimal(30, 0) NULL DEFAULT NULL COMMENT 'token 价格',
  `event_time` bigint(0) NULL DEFAULT NULL COMMENT '事件时间',
  `create_time` bigint(0) NULL DEFAULT NULL COMMENT '创建时间',
  `update_time` bigint(0) NULL DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `index_price`(`collection_address`, `price`, `event_time`) USING BTREE,
  INDEX `index_collection_address`(`collection_address`) USING BTREE,
  INDEX `index_event_time`(`event_time`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ob_collection_floor_price_sepolia
-- ----------------------------

-- ----------------------------
-- Table structure for ob_collection_import_record_sepolia
-- ----------------------------
DROP TABLE IF EXISTS `ob_collection_import_record_sepolia`;
CREATE TABLE `ob_collection_import_record_sepolia`  (
  `id` bigint(0) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `collection_address` varchar(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `msg` varchar(1600) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `finished_stage` tinyint(1) NOT NULL DEFAULT 0 COMMENT '已完成的阶段。0表示加入任务，1表示导入collection完成，2全部完成(指item导入完成，photo不好记录不影响此处的阶段)',
  `create_time` bigint(0) NOT NULL,
  `update_time` bigint(0) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ob_collection_import_record_sepolia
-- ----------------------------

-- ----------------------------
-- Table structure for ob_collection_sepolia
-- ----------------------------
DROP TABLE IF EXISTS `ob_collection_sepolia`;
CREATE TABLE `ob_collection_sepolia`  (
  `id` bigint(0) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `symbol` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '项目标识',
  `chain_id` bigint(0) NOT NULL DEFAULT 1 COMMENT '链类型(1:以太坊)',
  `auth` tinyint(0) NOT NULL DEFAULT 0 COMMENT '认证(0:默认未认证1:认证通过2:认证不通过)',
  `token_standard` bigint(0) NOT NULL COMMENT '合约实现标准',
  `name` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '项目名称',
  `creator` varchar(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建者',
  `address` varchar(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '链上合约地址',
  `owner_amount` bigint(0) NOT NULL DEFAULT 0 COMMENT '拥有item人数',
  `item_amount` bigint(0) NOT NULL DEFAULT 0 COMMENT '该项目NFT的发行总量',
  `description` varchar(2048) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '项目描述',
  `website` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '项目官网地址',
  `twitter` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '项目twitter地址',
  `discord` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '项目 discord 地址',
  `instagram` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '项目 instagram 地址',
  `floor_price` decimal(30, 0) NULL DEFAULT NULL COMMENT '整个collection中item的最低的listing价格',
  `sale_price` decimal(30, 0) NULL DEFAULT NULL COMMENT '整个collection中bid的最高的价格',
  `volume_total` decimal(30, 0) NULL DEFAULT NULL COMMENT '总交易量',
  `image_uri` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '项目封面图的链接',
  `banner_uri` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT 'banner image uri',
  `opensea_ban_scan` tinyint(0) NULL DEFAULT 0 COMMENT '（0.未扫描 1扫描过）',
  `is_syncing` tinyint(1) NOT NULL DEFAULT 0,
  `history_sale_sync` tinyint(0) NOT NULL DEFAULT 0,
  `history_overview` int(0) NOT NULL DEFAULT 0 COMMENT '是否生成历史overview 0:已经生成 1:等待生成 2:生成错误',
  `floor_price_status` int(0) NOT NULL DEFAULT 0,
  `create_time` bigint(0) NULL DEFAULT NULL COMMENT '创建时间',
  `update_time` bigint(0) NULL DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `index_unique_address`(`address`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ob_collection_sepolia
-- ----------------------------

-- ----------------------------
-- Table structure for ob_global_collection_sepolia
-- ----------------------------
DROP TABLE IF EXISTS `ob_global_collection_sepolia`;
CREATE TABLE `ob_global_collection_sepolia`  (
  `id` bigint(0) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `collection_address` varchar(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `token_standard` tinyint(0) NOT NULL DEFAULT 0,
  `import_status` tinyint(0) NOT NULL DEFAULT 0,
  `create_time` bigint(0) NOT NULL,
  `update_time` bigint(0) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ob_global_collection_sepolia
-- ----------------------------

-- ----------------------------
-- Table structure for ob_indexed_status
-- ----------------------------
DROP TABLE IF EXISTS `ob_indexed_status`;
CREATE TABLE `ob_indexed_status`  (
  `id` bigint(0) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `chain_id` bigint(0) NOT NULL DEFAULT 1 COMMENT '链id (1:以太坊, 56: BSC)',
  `last_indexed_block` bigint(0) NULL DEFAULT 0 COMMENT '区块号',
  `last_indexed_time` bigint(0) NULL DEFAULT NULL COMMENT '最后同步时间戳',
  `index_type` tinyint(0) NOT NULL DEFAULT 0 COMMENT '0:activity, 1:trade info, 2:listing,3:sale,4:exchange,5:floor price',
  `create_time` bigint(0) NULL DEFAULT NULL,
  `update_time` bigint(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ob_indexed_status
-- ----------------------------
INSERT INTO `ob_indexed_status` VALUES (1, 11155111, 7524355, 1735391871, 6, 1731324977, 1731324977);
INSERT INTO `ob_indexed_status` VALUES (2, 11155111, 7524201, 1734391871, 5, 1731324977, 1731324977);

-- ----------------------------
-- Table structure for ob_indexed_status_bak_20250409235850
-- ----------------------------
DROP TABLE IF EXISTS `ob_indexed_status_bak_20250409235850`;
CREATE TABLE `ob_indexed_status_bak_20250409235850`  (
  `id` bigint(0) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `chain_id` bigint(0) NOT NULL DEFAULT 1 COMMENT '链id (1:以太坊, 56: BSC)',
  `last_indexed_block` bigint(0) NULL DEFAULT 0 COMMENT '区块号',
  `last_indexed_time` bigint(0) NULL DEFAULT NULL COMMENT '最后同步时间戳',
  `index_type` tinyint(0) NOT NULL DEFAULT 0 COMMENT '0:activity, 1:trade info, 2:listing,3:sale,4:exchange,5:floor price',
  `create_time` bigint(0) NULL DEFAULT NULL,
  `update_time` bigint(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ob_indexed_status_bak_20250409235850
-- ----------------------------
INSERT INTO `ob_indexed_status_bak_20250409235850` VALUES (1, 11155111, 7439987, 1735391871, 6, 1731324977, 1731324977);
INSERT INTO `ob_indexed_status_bak_20250409235850` VALUES (2, 11155111, 7439740, 1734391871, 5, 1731324977, 1731324977);

-- ----------------------------
-- Table structure for ob_item_external_sepolia
-- ----------------------------
DROP TABLE IF EXISTS `ob_item_external_sepolia`;
CREATE TABLE `ob_item_external_sepolia`  (
  `id` bigint(0) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `collection_address` varchar(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `is_uploaded_oss` tinyint(1) NULL DEFAULT 0 COMMENT '是否已上传oss(0:未上传,1:已上传)',
  `upload_status` tinyint(0) NOT NULL DEFAULT 0 COMMENT '标记上传oss状态',
  `meta_data_uri` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '元数据地址',
  `image_uri` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `oss_uri` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '图片地址',
  `token_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `is_video_uploaded` tinyint(1) NULL DEFAULT 0 COMMENT 'video是否已上传oss(0:未上传,1:已上传)',
  `video_upload_status` tinyint(0) NOT NULL DEFAULT 0 COMMENT '标记video上传oss状态',
  `video_type` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0' COMMENT '标记video 类型',
  `video_uri` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT 'video 原始uri',
  `video_oss_uri` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT 'video oss uri',
  `create_time` bigint(0) NULL DEFAULT NULL,
  `update_time` bigint(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `index_collection_token`(`collection_address`, `token_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ob_item_external_sepolia
-- ----------------------------

-- ----------------------------
-- Table structure for ob_item_sepolia
-- ----------------------------
DROP TABLE IF EXISTS `ob_item_sepolia`;
CREATE TABLE `ob_item_sepolia`  (
  `id` bigint(0) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `chain_id` bigint(0) NOT NULL DEFAULT 1 COMMENT '链类型',
  `token_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'token_id',
  `name` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'nft名称',
  `owner` varchar(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '拥有者',
  `collection_address` varchar(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '合约地址',
  `creator` varchar(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '创建者',
  `supply` bigint(0) NOT NULL COMMENT 'item最多可以有多少份',
  `list_price` decimal(30, 0) NULL DEFAULT NULL COMMENT '上架价格',
  `list_time` bigint(0) NULL DEFAULT NULL COMMENT '上架时间',
  `sale_price` decimal(30, 0) NULL DEFAULT NULL COMMENT '销售价格',
  `views` bigint(0) NULL DEFAULT NULL COMMENT '浏览量',
  `is_opensea_banned` tinyint(1) NULL DEFAULT 0 COMMENT '是否被opensea标记禁止交易',
  `create_time` bigint(0) NULL DEFAULT NULL COMMENT '创建时间',
  `update_time` bigint(0) NULL DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `index_collection_token`(`collection_address`, `token_id`) USING BTREE,
  INDEX `index_collection_item_name`(`collection_address`, `token_id`, `name`) USING BTREE,
  INDEX `index_collection_owner`(`collection_address`, `owner`) USING BTREE,
  INDEX `index_collection_token_owner`(`collection_address`, `token_id`, `owner`) USING BTREE,
  INDEX `index_owner`(`owner`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ob_item_sepolia
-- ----------------------------

-- ----------------------------
-- Table structure for ob_item_trait_sepolia
-- ----------------------------
DROP TABLE IF EXISTS `ob_item_trait_sepolia`;
CREATE TABLE `ob_item_trait_sepolia`  (
  `id` bigint(0) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `collection_address` varchar(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'collection主键',
  `token_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'item主键',
  `trait` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '属性名称',
  `trait_value` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '属性值',
  `create_time` bigint(0) NULL DEFAULT NULL COMMENT '创建时间',
  `update_time` bigint(0) NULL DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `index_collection_token`(`collection_address`, `token_id`) USING BTREE,
  INDEX `index_collection_trait_value`(`collection_address`, `trait`, `trait_value`) USING BTREE,
  INDEX `index_trait_value`(`trait`, `trait_value`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ob_item_trait_sepolia
-- ----------------------------

-- ----------------------------
-- Table structure for ob_order_sepolia
-- ----------------------------
DROP TABLE IF EXISTS `ob_order_sepolia`;
CREATE TABLE `ob_order_sepolia`  (
  `id` bigint(0) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `marketplace_id` tinyint(0) NOT NULL DEFAULT 0 COMMENT '0.locol 1.opensea 2.looks 3.x2y2',
  `collection_address` varchar(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `token_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `order_id` varchar(66) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '订单hash',
  `order_status` tinyint(0) NOT NULL DEFAULT 0 COMMENT '标记订单状态',
  `event_time` bigint(0) NULL DEFAULT NULL COMMENT '订单时间',
  `expire_time` bigint(0) NULL DEFAULT NULL,
  `price` decimal(30, 0) NOT NULL,
  `maker` varchar(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `taker` varchar(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `quantity_remaining` bigint(0) NOT NULL DEFAULT 0,
  `size` bigint(0) NOT NULL DEFAULT 1,
  `currency_address` varchar(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '1',
  `order_type` tinyint(0) NOT NULL,
  `salt` bigint(0) NULL DEFAULT 0,
  `create_time` bigint(0) NULL DEFAULT NULL COMMENT '创建时间',
  `update_time` bigint(0) NULL DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `index_hash`(`order_id`) USING BTREE,
  INDEX `index_collection_maker_status_type_market_token_id`(`collection_address`, `maker`, `order_status`, `order_type`, `marketplace_id`, `token_id`) USING BTREE,
  INDEX `index_collection_token`(`collection_address`, `token_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ob_order_sepolia
-- ----------------------------
INSERT INTO `ob_order_sepolia` VALUES (1, 0, '0x8d0FF0aa2585c4cc5Ca17fFcD0b18f005072C29D', '50', '0xd82a4d1fac9a64fc54894ceceafd808bca3e76ac91ab3c48321eeed53eddcfa1', 2, 1744215748, 1737373949, 2000000000000000, '0x56E4F8273750577036d6385243aaB6287F280811', '0x0000000000000000000000000000000000000000', 1, 1, '0x0000000000000000000000000000000000000000', 1, 1, 1744215748915, 1744215748915);
INSERT INTO `ob_order_sepolia` VALUES (2, 0, '0x8d0FF0aa2585c4cc5Ca17fFcD0b18f005072C29D', '30', '0x86514814fc952f15c0ee51ea1d8864a1ea24eac3a430e0058f0344c1ace8ff24', 3, 1744215749, 1737374062, 2000000000000000, '0x56E4F8273750577036d6385243aaB6287F280811', '0x0000000000000000000000000000000000000000', 1, 1, '0x0000000000000000000000000000000000000000', 1, 1, 1744215749678, 1744215749678);
INSERT INTO `ob_order_sepolia` VALUES (3, 0, '0x8d0FF0aa2585c4cc5Ca17fFcD0b18f005072C29D', '31', '0x67185b6c672ca600295bd0f91c43a9054979f038238911759e754bd0aa29b295', 3, 1744215750, 1737374097, 2000000000000000, '0x56E4F8273750577036d6385243aaB6287F280811', '0x0000000000000000000000000000000000000000', 1, 1, '0x0000000000000000000000000000000000000000', 1, 1, 1744215750456, 1744215750456);
INSERT INTO `ob_order_sepolia` VALUES (4, 0, '0x8d0FF0aa2585c4cc5Ca17fFcD0b18f005072C29D', '32', '0x77f75fdf59fdcabc251693d661368f00b56e72140efe22e3e24b2ae964adde28', 3, 1744215750, 1737374117, 2000000000000000, '0x56E4F8273750577036d6385243aaB6287F280811', '0x0000000000000000000000000000000000000000', 1, 1, '0x0000000000000000000000000000000000000000', 1, 1, 1744215750719, 1744215750719);
INSERT INTO `ob_order_sepolia` VALUES (5, 0, '0x8d0FF0aa2585c4cc5Ca17fFcD0b18f005072C29D', '33', '0xc78b1d4242dd4e312fe120d8e17372d7f8e687804b0e66f76fb81d8e21297559', 2, 1744215750, 1737374134, 2000000000000000, '0x56E4F8273750577036d6385243aaB6287F280811', '0x0000000000000000000000000000000000000000', 1, 1, '0x0000000000000000000000000000000000000000', 1, 1, 1744215750986, 1744215750986);
INSERT INTO `ob_order_sepolia` VALUES (6, 0, '0x8d0FF0aa2585c4cc5Ca17fFcD0b18f005072C29D', '34', '0x64157521dcb3b927ea64aa8dc554f624803f7724642f86286d5c01ff0392a03a', 4, 1744215751, 1737374147, 2000000000000000, '0x56E4F8273750577036d6385243aaB6287F280811', '0x93c52E0fF5e2db87577CF2274125fCA9FB0F44c8', 0, 1, '0x0000000000000000000000000000000000000000', 1, 1, 1744215751247, 1744215751247);
INSERT INTO `ob_order_sepolia` VALUES (7, 0, '0x8d0FF0aa2585c4cc5Ca17fFcD0b18f005072C29D', '35', '0xa338d034b1f56dd2437428d4837be8b0c71c46cc32966aaf6e4be52e9075b4cc', 2, 1744215751, 1737374168, 2000000000000000, '0x56E4F8273750577036d6385243aaB6287F280811', '0x0000000000000000000000000000000000000000', 1, 1, '0x0000000000000000000000000000000000000000', 1, 1, 1744215751519, 1744215751519);
INSERT INTO `ob_order_sepolia` VALUES (8, 0, '0x8d0FF0aa2585c4cc5Ca17fFcD0b18f005072C29D', '36', '0x1dbe321a1c2b5310a549aeecd14c6042152dd598314ff5c50ed936144f43efc7', 2, 1744215751, 1737374180, 2000000000000000, '0x56E4F8273750577036d6385243aaB6287F280811', '0x0000000000000000000000000000000000000000', 1, 1, '0x0000000000000000000000000000000000000000', 1, 1, 1744215751774, 1744215751774);
INSERT INTO `ob_order_sepolia` VALUES (9, 0, '0x8d0FF0aa2585c4cc5Ca17fFcD0b18f005072C29D', '37', '0xc0a184f67917ca1134c23e035fc241cdfc3a24272a18111be469ab34cbc2b77f', 2, 1744215752, 1737374192, 2000000000000000, '0x56E4F8273750577036d6385243aaB6287F280811', '0x0000000000000000000000000000000000000000', 1, 1, '0x0000000000000000000000000000000000000000', 1, 1, 1744215752033, 1744215752033);
INSERT INTO `ob_order_sepolia` VALUES (10, 0, '0x8d0FF0aa2585c4cc5Ca17fFcD0b18f005072C29D', '38', '0xc959d2af837bd38466b828c87f179cce81becbfc3d61e5d19cdd7db498c905b0', 2, 1744215752, 1737374204, 2000000000000000, '0x56E4F8273750577036d6385243aaB6287F280811', '0x0000000000000000000000000000000000000000', 1, 1, '0x0000000000000000000000000000000000000000', 1, 1, 1744215752291, 1744215752291);
INSERT INTO `ob_order_sepolia` VALUES (11, 0, '0x8d0FF0aa2585c4cc5Ca17fFcD0b18f005072C29D', '39', '0x3580bdccff6c7d668d2ee46cbb2f566bf045e5009d73060238a7bda4de8fba9f', 2, 1744215752, 1737374216, 2000000000000000, '0x56E4F8273750577036d6385243aaB6287F280811', '0x0000000000000000000000000000000000000000', 1, 1, '0x0000000000000000000000000000000000000000', 1, 1, 1744215752549, 1744215752549);
INSERT INTO `ob_order_sepolia` VALUES (12, 0, '0x8d0FF0aa2585c4cc5Ca17fFcD0b18f005072C29D', '40', '0x5b8952d5edfb6089e114c11a55513002667256f449277b30ec99b972db055e39', 2, 1744215753, 1737374229, 2000000000000000, '0x56E4F8273750577036d6385243aaB6287F280811', '0x0000000000000000000000000000000000000000', 1, 1, '0x0000000000000000000000000000000000000000', 1, 1, 1744215753305, 1744215753305);
INSERT INTO `ob_order_sepolia` VALUES (13, 0, '0x8d0FF0aa2585c4cc5Ca17fFcD0b18f005072C29D', '41', '0x1840a178bffb9e44798a53fcf56a87c51feba867a2f9b0eb8a352bde79ab8b83', 2, 1744215753, 1737374240, 2000000000000000, '0x56E4F8273750577036d6385243aaB6287F280811', '0x0000000000000000000000000000000000000000', 1, 1, '0x0000000000000000000000000000000000000000', 1, 1, 1744215753563, 1744215753563);
INSERT INTO `ob_order_sepolia` VALUES (14, 0, '0x8d0FF0aa2585c4cc5Ca17fFcD0b18f005072C29D', '42', '0x8a77447fcfd736876e488a74e7d50430e71178ba9a92070dbcaf36273e959024', 2, 1744215754, 1737374252, 2000000000000000, '0x56E4F8273750577036d6385243aaB6287F280811', '0x0000000000000000000000000000000000000000', 1, 1, '0x0000000000000000000000000000000000000000', 1, 1, 1744215754036, 1744215754036);
INSERT INTO `ob_order_sepolia` VALUES (15, 0, '0x8d0FF0aa2585c4cc5Ca17fFcD0b18f005072C29D', '43', '0x06f000f9675493f8d3b931eb31f85c8b8298a4fcff0e3973d1d64efed98847ea', 2, 1744215754, 1737374264, 2000000000000000, '0x56E4F8273750577036d6385243aaB6287F280811', '0x0000000000000000000000000000000000000000', 1, 1, '0x0000000000000000000000000000000000000000', 1, 1, 1744215754290, 1744215754290);
INSERT INTO `ob_order_sepolia` VALUES (16, 0, '0x8d0FF0aa2585c4cc5Ca17fFcD0b18f005072C29D', '44', '0x0c14830a059c606af73a7efbc3c9cc8e2d7355d016a27388c12208271ccca12c', 2, 1744215754, 1737374288, 2000000000000000, '0x56E4F8273750577036d6385243aaB6287F280811', '0x0000000000000000000000000000000000000000', 1, 1, '0x0000000000000000000000000000000000000000', 1, 1, 1744215754550, 1744215754550);
INSERT INTO `ob_order_sepolia` VALUES (17, 0, '0x8d0FF0aa2585c4cc5Ca17fFcD0b18f005072C29D', '45', '0xcfb284b49bf509cbe8d2794865baaeb2ab7fbd89f47eaedd6dd9c59e9524cbc1', 2, 1744215754, 1737374301, 2000000000000000, '0x56E4F8273750577036d6385243aaB6287F280811', '0x0000000000000000000000000000000000000000', 1, 1, '0x0000000000000000000000000000000000000000', 1, 1, 1744215754806, 1744215754806);

-- ----------------------------
-- Table structure for ob_user
-- ----------------------------
DROP TABLE IF EXISTS `ob_user`;
CREATE TABLE `ob_user`  (
  `id` bigint(0) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `address` varchar(66) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '用户地址',
  `is_allowed` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否允许用户访问',
  `is_signed` tinyint(1) NULL DEFAULT 0,
  `create_time` bigint(0) NULL DEFAULT NULL COMMENT '创建时间',
  `update_time` bigint(0) NULL DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `index_address`(`address`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ob_user
-- ----------------------------

SET FOREIGN_KEY_CHECKS = 1;
