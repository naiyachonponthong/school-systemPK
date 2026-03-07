-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 06, 2026 at 12:46 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `personnel_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `audit_logs`
--

CREATE TABLE `audit_logs` (
  `id` varchar(36) NOT NULL DEFAULT uuid(),
  `user_id` varchar(36) DEFAULT NULL,
  `action` varchar(100) DEFAULT NULL,
  `entity` varchar(100) DEFAULT NULL,
  `entity_id` varchar(36) DEFAULT NULL,
  `details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`details`)),
  `ip_address` varchar(45) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `awards`
--

CREATE TABLE `awards` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `academic_year` varchar(10) DEFAULT NULL,
  `award_name` varchar(255) DEFAULT NULL,
  `level` varchar(100) DEFAULT NULL,
  `organization` varchar(255) DEFAULT NULL,
  `received_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `details` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `competition`
--

CREATE TABLE `competition` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `academic_year` varchar(10) DEFAULT NULL,
  `competition_name` varchar(255) DEFAULT NULL,
  `level` varchar(100) DEFAULT NULL,
  `result` varchar(100) DEFAULT NULL,
  `student_names` text DEFAULT NULL,
  `competition_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `details` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `competition`
--

INSERT INTO `competition` (`id`, `user_id`, `academic_year`, `competition_name`, `level`, `result`, `student_names`, `competition_date`, `created_at`, `updated_at`, `details`) VALUES
('07311740-cbc9-4342-ae13-6296437c25f7', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, NULL, NULL, NULL, '2026-02-24 16:59:44', '2026-02-24 16:59:44', '{\"c\":[]}'),
('2576e9fe-1e18-42da-839d-4d9697525e12', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, NULL, NULL, NULL, '2026-02-24 16:34:33', '2026-02-24 16:34:33', '{\"c\":[]}'),
('31e83f7f-3bc4-4463-86fe-2bbdcfd3670c', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, NULL, NULL, NULL, '2026-02-24 16:37:34', '2026-02-24 16:37:34', '{\"c\":[]}'),
('405f53f0-be4f-443f-b2cf-17ddae6d8780', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, NULL, NULL, NULL, '2026-02-24 16:28:10', '2026-02-24 16:28:10', '{\"competitions\":[]}'),
('41204ba5-bf57-4ad8-97d1-1b2303d2afc1', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, NULL, NULL, NULL, '2026-02-24 16:32:27', '2026-02-24 16:32:27', '{\"c\":[]}'),
('4417fcc8-ab6b-4d3e-b356-67a6400ce0b6', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, NULL, NULL, NULL, '2026-02-24 16:49:35', '2026-02-24 16:49:35', '{\"c\":[]}'),
('5f40b362-4cd2-4586-90cd-12fc3ff15a1c', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, NULL, NULL, NULL, '2026-02-24 16:42:20', '2026-02-24 16:42:20', '{\"c\":[]}'),
('651b6313-629e-4acf-9f4d-081891268a0e', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, NULL, NULL, NULL, '2026-02-24 16:30:48', '2026-02-24 16:30:48', '{\"c\":[]}'),
('93012a3d-82b5-4c4a-9eb6-0858eacff659', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, NULL, NULL, NULL, '2026-02-24 16:57:44', '2026-02-24 16:57:44', '{\"c\":[]}'),
('93081870-9173-4136-9a85-6d8ee44795fd', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, NULL, NULL, NULL, '2026-02-24 16:50:28', '2026-02-24 16:50:28', '{\"c\":[]}'),
('94388f7b-3895-428d-af9f-4c5d7caced01', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, NULL, NULL, NULL, '2026-02-24 16:26:23', '2026-02-24 16:26:23', '{\"competitions\":[]}'),
('9604f34e-5599-4475-a6bf-896ce2b3fe45', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, NULL, NULL, NULL, '2026-02-24 16:54:52', '2026-02-24 16:54:52', '{\"c\":[]}'),
('aafbfb74-ba70-4da3-9bf0-c9a4711c52fb', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, NULL, NULL, NULL, '2026-02-24 16:47:25', '2026-02-24 16:47:25', '{\"c\":[]}'),
('b1319a6d-571c-49e6-8dea-36b8d752ab4a', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, NULL, NULL, NULL, '2026-02-24 16:40:58', '2026-02-24 16:40:58', '{\"c\":[]}'),
('b6c0ebe1-6a5a-4e92-b927-951dc65cf58d', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, NULL, NULL, NULL, '2026-02-24 16:20:35', '2026-02-24 16:20:35', '{\"test\":1}'),
('bd769d37-424d-40c6-b97f-39d53ffd7085', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, NULL, NULL, NULL, '2026-02-24 16:28:23', '2026-02-24 16:28:23', '{\"competitions\":[]}'),
('ed42d835-9f93-4ac0-bc71-375394b8d630', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, NULL, NULL, NULL, '2026-02-24 16:35:38', '2026-02-24 16:35:38', '{\"c\":[]}'),
('fdffb103-6ac9-46b7-8ad5-6d0818c97931', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, NULL, NULL, NULL, '2026-02-24 16:56:12', '2026-02-24 16:56:12', '{\"c\":[]}'),
('fe95b4ae-3899-4bc2-95c0-bfa4ccebd909', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, NULL, NULL, NULL, '2026-02-24 16:43:44', '2026-02-24 16:43:44', '{\"c\":[]}');

-- --------------------------------------------------------

--
-- Table structure for table `config`
--

CREATE TABLE `config` (
  `id` varchar(36) NOT NULL,
  `app_name` varchar(255) NOT NULL,
  `app_name_en` varchar(255) DEFAULT NULL,
  `logo_url` varchar(255) DEFAULT NULL,
  `school_name` varchar(255) NOT NULL,
  `school_name_en` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `subdistrict` varchar(100) DEFAULT NULL,
  `district` varchar(100) DEFAULT NULL,
  `province` varchar(100) DEFAULT NULL,
  `postal_code` varchar(10) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `positions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`positions`)),
  `positions_en` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`positions_en`)),
  `grade_levels` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`grade_levels`)),
  `grade_levels_en` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`grade_levels_en`)),
  `academic_years` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`academic_years`)),
  `current_academic_year` varchar(10) DEFAULT NULL,
  `language` varchar(10) DEFAULT 'th',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `config`
--

INSERT INTO `config` (`id`, `app_name`, `app_name_en`, `logo_url`, `school_name`, `school_name_en`, `address`, `subdistrict`, `district`, `province`, `postal_code`, `phone`, `email`, `positions`, `positions_en`, `grade_levels`, `grade_levels_en`, `academic_years`, `current_academic_year`, `language`, `created_at`, `updated_at`) VALUES
('461b399b-1196-11f1-84bd-345a605ca61b', 'ระบบทดสอบ1', 'Personnel Management System', '/uploads/logo_1771953294449.png', 'โรงเรียนตัวอย่าง', 'Sample School', '', 'null', '', '', '', '', '', '[\"ครู\",\"ครูผู้ช่วย\",\"พนักงานราชการ\",\"ลูกจ้างประจำ\",\"ลูกจ้างชั่วคราว\"]', '[\"Teacher\",\"Assistant Teacher\",\"Government Employee\",\"Permanent Employee\",\"Temporary Employee\"]', '[\"ปฐมวัย\",\"ป.1\",\"ป.2\",\"ป.3\",\"ป.4\",\"ป.5\",\"ป.6\",\"ม.1\",\"ม.2\",\"ม.3\",\"ม.4\",\"ม.5\",\"ม.6\"]', '[\"Kindergarten\",\"G.1\",\"G.2\",\"G.3\",\"G.4\",\"G.5\",\"G.6\",\"G.7\",\"G.8\",\"G.9\",\"G.10\",\"G.11\",\"G.12\"]', '[\"2567\",\"2568\",\"2569\",\"2570\"]', '2567', 'th', '2026-02-24 15:34:14', '2026-02-24 17:14:56');

-- --------------------------------------------------------

--
-- Table structure for table `duty_assignments`
--

CREATE TABLE `duty_assignments` (
  `id` varchar(36) NOT NULL,
  `schedule_id` varchar(36) DEFAULT NULL,
  `user_id` varchar(36) DEFAULT NULL,
  `cell` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `duty_locations`
--

CREATE TABLE `duty_locations` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `category` varchar(50) DEFAULT NULL,
  `color` varchar(30) DEFAULT NULL,
  `period` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `duty_schedules`
--

CREATE TABLE `duty_schedules` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) DEFAULT NULL,
  `location_id` varchar(36) DEFAULT NULL,
  `duty_date` date NOT NULL,
  `shift` varchar(50) DEFAULT NULL,
  `status` enum('scheduled','checked_in','checked_out','absent') DEFAULT 'scheduled',
  `checkin_time` datetime DEFAULT NULL,
  `checkout_time` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `education`
--

CREATE TABLE `education` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `level` varchar(100) DEFAULT NULL,
  `degree` varchar(255) DEFAULT NULL,
  `major` varchar(255) DEFAULT NULL,
  `institution` varchar(255) DEFAULT NULL,
  `graduation_year` varchar(10) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `academic_year` varchar(10) DEFAULT NULL,
  `details` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `education`
--

INSERT INTO `education` (`id`, `user_id`, `level`, `degree`, `major`, `institution`, `graduation_year`, `created_at`, `updated_at`, `academic_year`, `details`) VALUES
('011a136e-183f-4a15-b954-e3fffa151749', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'ป.ตรี', 'ศษ.บ.', NULL, NULL, NULL, '2026-02-24 16:30:48', '2026-02-24 16:30:48', '2567', NULL),
('049db8eb-cdd5-486d-b1b9-204a016638d6', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'ป.ตรี', 'ศษ.บ.', NULL, NULL, NULL, '2026-02-24 16:32:27', '2026-02-24 16:32:27', '2567', NULL),
('0c711a24-dfd9-448b-84df-58caf6c6b7f5', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'ป.ตรี', 'ศษ.บ.', NULL, NULL, NULL, '2026-02-24 16:50:28', '2026-02-24 16:50:28', '2567', NULL),
('168340b4-6ff4-4b08-812d-cd8b40c89669', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'ป.ตรี', 'ศษ.บ.', NULL, NULL, NULL, '2026-02-24 16:37:34', '2026-02-24 16:37:34', '2567', NULL),
('20295414-6e9c-4104-96e1-1a24012c0ff7', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'ป.ตรี', 'ศษ.บ.', NULL, NULL, NULL, '2026-02-24 16:49:35', '2026-02-24 16:49:35', '2567', NULL),
('2503af58-6b71-49ec-900f-586daedb02dd', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '???????', 'B.Sc.', NULL, NULL, NULL, '2026-02-24 15:56:18', '2026-02-24 15:56:18', NULL, NULL),
('5424a434-bf98-42d4-88fc-3ae9bf0383df', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'ป.ตรี', 'ศษ.บ.', NULL, NULL, NULL, '2026-02-24 16:56:12', '2026-02-24 16:56:12', '2567', NULL),
('7c48158a-4412-41fb-8c89-6c1f8ec779cd', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'ป.ตรี', 'ศษ.บ.', NULL, NULL, NULL, '2026-02-24 16:40:58', '2026-02-24 16:40:58', '2567', NULL),
('83382daa-07ed-421a-a34f-9cbb26c4a784', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'ป.ตรี', 'ศษ.บ.', NULL, NULL, NULL, '2026-02-24 16:59:44', '2026-02-24 16:59:44', '2567', NULL),
('86b1e044-6775-4a4a-8674-d04fddb61189', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'ป.ตรี', 'ศษ.บ.', NULL, NULL, NULL, '2026-02-24 16:35:38', '2026-02-24 16:35:38', '2567', NULL),
('95e6dc9f-d552-46a1-833a-c245d7ddcb4f', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'ปริญญาตรี', 'ศษ.บ.', NULL, NULL, NULL, '2026-02-24 16:28:23', '2026-02-24 16:28:23', '2567', NULL),
('a81ef3b8-7650-4205-af32-79c17d0eafab', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'ป.ตรี', 'ศษ.บ.', NULL, NULL, NULL, '2026-02-24 16:47:25', '2026-02-24 16:47:25', '2567', NULL),
('ae303652-3056-44f0-832b-753933963856', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'ป.ตรี', 'ศษ.บ.', NULL, NULL, NULL, '2026-02-24 16:34:33', '2026-02-24 16:34:33', '2567', NULL),
('b523e665-97a1-4cc2-8a1f-a255eb320ff4', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'ปริญญาตรี', 'ศษ.บ.', NULL, NULL, NULL, '2026-02-24 16:28:10', '2026-02-24 16:28:10', '2567', NULL),
('c9b99933-9778-4beb-ab5f-9dbf9a0fec8d', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'ปริญญาตรี', 'ศษ.บ.', NULL, NULL, NULL, '2026-02-24 16:26:23', '2026-02-24 16:26:23', '2567', NULL),
('ca07f03d-a63c-4184-9ade-4dd2413b4644', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'ป.ตรี', 'ศษ.บ.', NULL, NULL, NULL, '2026-02-24 16:43:44', '2026-02-24 16:43:44', '2567', NULL),
('cd893a67-39ab-4859-8c07-d815dcc512d5', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'ป.ตรี', 'ศษ.บ.', NULL, NULL, NULL, '2026-02-24 16:54:52', '2026-02-24 16:54:52', '2567', NULL),
('cddb6f70-4a37-4361-8867-5978f0ef3165', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'ป.ตรี', 'ศษ.บ.', NULL, NULL, NULL, '2026-02-24 16:57:44', '2026-02-24 16:57:44', '2567', NULL),
('d0ef1d52-03df-41bb-9813-944aaf165e31', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'ป.ตรี', 'ศษ.บ.', NULL, NULL, NULL, '2026-02-24 16:42:20', '2026-02-24 16:42:20', '2567', NULL),
('f93932f1-7705-41c8-9587-5e1c9a635e32', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '?????????', '????????????????', '??????????', '?.???????', '2555', '2026-02-24 16:17:08', '2026-02-24 16:17:08', '2567', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `field_trip`
--

CREATE TABLE `field_trip` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `academic_year` varchar(10) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `trip_date` date DEFAULT NULL,
  `student_count` int(11) DEFAULT NULL,
  `objective` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `details` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `field_trip`
--

INSERT INTO `field_trip` (`id`, `user_id`, `academic_year`, `location`, `trip_date`, `student_count`, `objective`, `created_at`, `updated_at`, `details`) VALUES
('0209fb86-c31b-4d58-a155-89873167a5e6', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, NULL, NULL, '2026-02-24 16:32:27', '2026-02-24 16:32:27', '{\"t\":[]}'),
('0b7b2088-1ed3-4414-a7be-4f09c35cf905', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, NULL, NULL, '2026-02-24 16:26:23', '2026-02-24 16:26:23', '{\"trips\":[]}'),
('2e437c5d-42db-4bce-ab8f-23d56851f862', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, NULL, NULL, '2026-02-24 16:49:35', '2026-02-24 16:49:35', '{\"t\":[]}'),
('36015375-05f2-441e-9127-67186e9fe7cc', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, NULL, NULL, '2026-02-24 16:28:10', '2026-02-24 16:28:10', '{\"trips\":[]}'),
('3cc8418d-4ca6-4dbd-b4fc-e645eab54af1', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, NULL, NULL, '2026-02-24 16:35:38', '2026-02-24 16:35:38', '{\"t\":[]}'),
('51a35199-813c-4410-8b6a-c3bbbf610bc2', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, NULL, NULL, '2026-02-24 16:34:33', '2026-02-24 16:34:33', '{\"t\":[]}'),
('56518a1c-c5de-4750-bc59-25ee13ce6696', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, NULL, NULL, '2026-02-24 16:56:12', '2026-02-24 16:56:12', '{\"t\":[]}'),
('587580d5-2065-424c-9f39-d266f8463659', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, NULL, NULL, '2026-02-24 16:20:35', '2026-02-24 16:20:35', '{\"test\":1}'),
('735087c9-3223-4454-ade1-f377edd65161', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, NULL, NULL, '2026-02-24 16:50:28', '2026-02-24 16:50:28', '{\"t\":[]}'),
('772da1eb-556b-41ac-8231-e907bb0a94aa', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, NULL, NULL, '2026-02-24 16:42:20', '2026-02-24 16:42:20', '{\"t\":[]}'),
('a9f66601-e7ef-4a65-81a4-a0d0fbf32a62', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, NULL, NULL, '2026-02-24 16:37:34', '2026-02-24 16:37:34', '{\"t\":[]}'),
('a9fe5f8c-53ee-4a72-b78b-c200f3b6843a', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, NULL, NULL, '2026-02-24 16:47:25', '2026-02-24 16:47:25', '{\"t\":[]}'),
('cffa8ea0-e7be-4a73-9246-ff1128ee76b5', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, NULL, NULL, '2026-02-24 16:40:58', '2026-02-24 16:40:58', '{\"t\":[]}'),
('d0de8cfc-b016-4a98-9e5c-89e98b423570', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, NULL, NULL, '2026-02-24 16:43:44', '2026-02-24 16:43:44', '{\"t\":[]}'),
('d1293627-6477-40ee-a971-cc766737ee45', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, NULL, NULL, '2026-02-24 16:28:23', '2026-02-24 16:28:23', '{\"trips\":[]}'),
('dbb43727-4f1e-42f9-8d4d-88cecf8872da', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, NULL, NULL, '2026-02-24 16:57:44', '2026-02-24 16:57:44', '{\"t\":[]}'),
('de0c13d9-1737-4af9-9338-db233319d877', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, NULL, NULL, '2026-02-24 16:30:48', '2026-02-24 16:30:48', '{\"t\":[]}'),
('e8074357-cb84-48f8-90fe-931245dbbac4', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, NULL, NULL, '2026-02-24 16:54:52', '2026-02-24 16:54:52', '{\"t\":[]}'),
('ff9d493b-16b3-41e5-822b-0bad48af09c7', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, NULL, NULL, '2026-02-24 16:59:44', '2026-02-24 16:59:44', '{\"t\":[]}');

-- --------------------------------------------------------

--
-- Table structure for table `media_production`
--

CREATE TABLE `media_production` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `academic_year` varchar(10) DEFAULT NULL,
  `media_name` varchar(255) DEFAULT NULL,
  `media_type` varchar(100) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `details` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `media_production`
--

INSERT INTO `media_production` (`id`, `user_id`, `academic_year`, `media_name`, `media_type`, `subject`, `created_at`, `updated_at`, `details`) VALUES
('187a43a1-da2b-4001-a6a8-c333c581f5dd', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, NULL, '2026-02-24 16:28:23', '2026-02-24 16:28:23', '{\"medias\":[]}'),
('1ba6c957-93fb-45e3-a429-4c932e6603a9', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, NULL, '2026-02-24 16:20:35', '2026-02-24 16:20:35', '{\"test\":1}'),
('5979cd4f-9f56-448b-9062-d81f0a489cff', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, NULL, '2026-02-24 16:28:10', '2026-02-24 16:28:10', '{\"medias\":[]}'),
('9956764c-1054-44b1-afee-5915e7a770fd', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, NULL, '2026-02-24 16:26:23', '2026-02-24 16:26:23', '{\"medias\":[]}');

-- --------------------------------------------------------

--
-- Table structure for table `media_usage`
--

CREATE TABLE `media_usage` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `academic_year` varchar(10) DEFAULT NULL,
  `media_name` varchar(255) DEFAULT NULL,
  `source` varchar(255) DEFAULT NULL,
  `usage_count` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `details` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `media_usage`
--

INSERT INTO `media_usage` (`id`, `user_id`, `academic_year`, `media_name`, `source`, `usage_count`, `created_at`, `updated_at`, `details`) VALUES
('28c06a60-cd4b-46c1-9077-969cb8e9811e', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, NULL, '2026-02-24 16:20:35', '2026-02-24 16:20:35', '{\"test\":1}');

-- --------------------------------------------------------

--
-- Table structure for table `meetings`
--

CREATE TABLE `meetings` (
  `id` varchar(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `meeting_date` datetime DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `created_by` varchar(36) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `start_time` varchar(10) DEFAULT NULL,
  `end_time` varchar(10) DEFAULT NULL,
  `status` enum('scheduled','in_progress','completed','cancelled') DEFAULT 'scheduled',
  `require_qr` tinyint(1) DEFAULT 0,
  `require_location` tinyint(1) DEFAULT 0,
  `location_lat` decimal(10,8) DEFAULT NULL,
  `location_lng` decimal(11,8) DEFAULT NULL,
  `location_radius` int(11) DEFAULT 100,
  `qr_token` varchar(36) DEFAULT NULL,
  `qr_expires_at` datetime DEFAULT NULL,
  `qr_type` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `meetings`
--

INSERT INTO `meetings` (`id`, `title`, `description`, `meeting_date`, `location`, `created_by`, `created_at`, `updated_at`, `start_time`, `end_time`, `status`, `require_qr`, `require_location`, `location_lat`, `location_lng`, `location_radius`, `qr_token`, `qr_expires_at`, `qr_type`) VALUES
('4def04db-65e9-4e2f-9728-a8fc7dc93507', 'Test Meeting', NULL, '2026-03-01 00:00:00', '??????????', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2026-02-24 16:12:03', '2026-02-24 17:13:10', '09:00', '11:00', 'completed', 0, 0, NULL, NULL, 100, '22f4881a-033d-4dfc-a877-9759ea327f7c', '2026-02-25 00:18:10', 'checkout');

-- --------------------------------------------------------

--
-- Table structure for table `meeting_attendees`
--

CREATE TABLE `meeting_attendees` (
  `meeting_id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `checkin_time` datetime DEFAULT NULL,
  `checkout_time` datetime DEFAULT NULL,
  `device_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_info`
--

CREATE TABLE `personal_info` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `academic_year` varchar(10) DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `id_card` varchar(20) DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `blood_group` varchar(10) DEFAULT NULL,
  `nationality` varchar(50) DEFAULT NULL,
  `race` varchar(50) DEFAULT NULL,
  `religion` varchar(50) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `contact_address` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `teacher_id` varchar(50) DEFAULT NULL,
  `ethnicity` varchar(100) DEFAULT NULL,
  `blood_type` varchar(10) DEFAULT NULL,
  `marital_status` varchar(50) DEFAULT NULL,
  `photo_url` text DEFAULT NULL,
  `reg_house_no` varchar(50) DEFAULT NULL,
  `reg_moo` varchar(50) DEFAULT NULL,
  `reg_road` varchar(100) DEFAULT NULL,
  `reg_subdistrict` varchar(100) DEFAULT NULL,
  `reg_district` varchar(100) DEFAULT NULL,
  `reg_province` varchar(100) DEFAULT NULL,
  `reg_zip` varchar(10) DEFAULT NULL,
  `curr_house_no` varchar(50) DEFAULT NULL,
  `curr_moo` varchar(50) DEFAULT NULL,
  `curr_road` varchar(100) DEFAULT NULL,
  `curr_subdistrict` varchar(100) DEFAULT NULL,
  `curr_district` varchar(100) DEFAULT NULL,
  `curr_province` varchar(100) DEFAULT NULL,
  `curr_zip` varchar(10) DEFAULT NULL,
  `father_name` varchar(255) DEFAULT NULL,
  `father_occ` varchar(255) DEFAULT NULL,
  `father_phone` varchar(20) DEFAULT NULL,
  `mother_name` varchar(255) DEFAULT NULL,
  `mother_occ` varchar(255) DEFAULT NULL,
  `mother_phone` varchar(20) DEFAULT NULL,
  `spouse_name` varchar(255) DEFAULT NULL,
  `spouse_occ` varchar(255) DEFAULT NULL,
  `spouse_phone` varchar(20) DEFAULT NULL,
  `children_info` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_info`
--

INSERT INTO `personal_info` (`id`, `user_id`, `academic_year`, `full_name`, `id_card`, `birth_date`, `blood_group`, `nationality`, `race`, `religion`, `address`, `contact_address`, `created_at`, `updated_at`, `teacher_id`, `ethnicity`, `blood_type`, `marital_status`, `photo_url`, `reg_house_no`, `reg_moo`, `reg_road`, `reg_subdistrict`, `reg_district`, `reg_province`, `reg_zip`, `curr_house_no`, `curr_moo`, `curr_road`, `curr_subdistrict`, `curr_district`, `curr_province`, `curr_zip`, `father_name`, `father_occ`, `father_phone`, `mother_name`, `mother_occ`, `mother_phone`, `spouse_name`, `spouse_occ`, `spouse_phone`, `children_info`) VALUES
('1b0df8f9-bc32-4934-9444-71f9901c67d5', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', 'ทดสอบ', NULL, NULL, NULL, 'ไทย', NULL, 'พุทธ', NULL, NULL, '2026-02-24 16:35:38', '2026-02-24 17:06:09', 'T001', 'ไทย', 'A', 'โสด', '/uploads/qrcode_312944993_0d52ebad8835ab7830972a8cd9cad245.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]'),
('286bc6fd-3988-40c0-89e0-523f04e5f913', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', 'ทดสอบ', '1234567890123', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-24 16:26:23', '2026-02-24 16:26:23', 'T001', NULL, 'A', 'single', NULL, NULL, NULL, NULL, NULL, NULL, 'กรุงเทพ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]'),
('2fbd7d02-6c9a-4700-9506-9a27cf996b11', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', 'ทดสอบ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-24 16:59:44', '2026-02-24 16:59:44', 'T001', NULL, 'A', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('34ce3197-5892-4cdf-98cc-4a4ad997c06d', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', 'ทดสอบ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-24 16:34:33', '2026-02-24 16:34:33', 'T001', NULL, 'A', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('42c06679-b001-4863-a05c-4955022dbba6', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', 'ทดสอบ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-24 16:37:34', '2026-02-24 16:37:34', 'T001', NULL, 'A', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('4a72d73b-8100-4f03-9ec2-41e965428ecd', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', 'ทดสอบ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-24 16:50:28', '2026-02-24 16:50:28', 'T001', NULL, 'A', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('4e1383ed-3a48-496d-b1de-0464326a2190', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', 'ทดสอบ', '1234567890123', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-24 16:28:10', '2026-02-24 16:28:10', 'T001', NULL, 'A', 'single', NULL, NULL, NULL, NULL, NULL, NULL, 'กรุงเทพ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]'),
('51d5a3ae-3c0c-48d6-b626-e23f0f8d61d2', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', 'ทดสอบ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-24 16:43:44', '2026-02-24 16:43:44', 'T001', NULL, 'A', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('5a7265ec-2ff2-4646-89f2-bb4666907254', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', 'ทดสอบ', '1234567890123', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-24 16:28:23', '2026-02-24 16:28:23', 'T001', NULL, 'A', 'single', NULL, NULL, NULL, NULL, NULL, NULL, 'กรุงเทพ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[]'),
('99e21104-3617-46f2-b63b-d93428c0d721', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', 'ทดสอบ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-24 16:40:58', '2026-02-24 16:40:58', 'T001', NULL, 'A', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('9a0536fe-a79f-4d1c-b453-1fe3fb1e6cd1', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', 'ทดสอบ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-24 16:57:44', '2026-02-24 16:57:44', 'T001', NULL, 'A', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('a86e9178-25e8-4582-bf19-22b1cbff66e3', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', 'ทดสอบ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-24 16:30:48', '2026-02-24 16:30:48', 'T001', NULL, 'A', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('aab70f56-f659-4de8-b953-e662dd72082a', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', 'ทดสอบ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-24 16:54:52', '2026-02-24 16:54:52', 'T001', NULL, 'A', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('ad245398-999c-4e8a-81f1-2b8895b06bdb', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', 'Test', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-24 15:56:09', '2026-02-24 15:56:09', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('baba64b1-1cb8-4df6-8c53-69053bd79844', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', 'ทดสอบ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-24 16:49:35', '2026-02-24 16:49:35', 'T001', NULL, 'A', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('bd3b1dab-5f3f-4eef-8422-1007280cf087', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', 'ทดสอบ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-24 16:47:25', '2026-02-24 16:47:25', 'T001', NULL, 'A', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('bd6f9a3b-eb00-4092-b8f1-d617a0c58c2c', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', 'ทดสอบ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-24 16:56:12', '2026-02-24 16:56:12', 'T001', NULL, 'A', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('bef0971e-9700-4f2a-a822-547980051768', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', 'ทดสอบ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-24 16:42:20', '2026-02-24 16:42:20', 'T001', NULL, 'A', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('f5bc0382-60a6-4db5-8904-6e820b3c9507', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', 'ทดสอบ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-24 16:32:27', '2026-02-24 16:32:27', 'T001', NULL, 'A', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `position_duty`
--

CREATE TABLE `position_duty` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `academic_year` varchar(10) DEFAULT NULL,
  `duty_type` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `details` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `position_duty`
--

INSERT INTO `position_duty` (`id`, `user_id`, `academic_year`, `duty_type`, `description`, `created_at`, `updated_at`, `details`) VALUES
('045551e0-9933-4a21-8d90-d73c902ece12', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, '2026-02-24 16:34:33', '2026-02-24 17:07:03', '{\"department\":\"academic\",\"position\":\"head_curriculum\",\"is_homeroom\":\"no\",\"teaching_class\":\"\",\"student_count_male\":\"\",\"student_count_female\":\"\",\"teaching_level\":\"\",\"is_special_teacher\":\"no\",\"probation_work\":{\"responsible\":\"\",\"plan\":\"\",\"project\":\"\",\"others\":\"\"},\"student_affairs_work\":{\"responsible\":\"\",\"plan\":\"\",\"project\":\"\",\"others\":\"\"},\"personnel_work\":{\"responsible\":\"\",\"plan\":\"\",\"project\":\"\",\"others\":\"\"}}'),
('0c534bfc-70e4-4cdb-a0bf-c1f1cc779f9b', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, '2026-02-24 16:28:10', '2026-02-24 16:28:10', '{\"duties\":[]}'),
('278b1155-b38f-4cb2-8ee0-83bdd3b466da', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, '2026-02-24 16:30:48', '2026-02-24 16:30:48', '{\"duties\":[]}'),
('2d2e8a62-d3ce-4714-b294-b9694f6b8a4c', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, '2026-02-24 16:37:34', '2026-02-24 16:37:34', '{\"duties\":[]}'),
('4251f0d2-7394-4da2-9d4d-f67de5115139', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, '2026-02-24 16:50:28', '2026-02-24 16:50:28', '{\"duties\":[]}'),
('47404ce8-d161-429c-a8ae-300e452c3a4d', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, '2026-02-24 16:26:23', '2026-02-24 16:26:23', '{\"duties\":[]}'),
('6c5e58a6-9dd4-4fdd-8be2-c6b2772b932c', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, '2026-02-24 16:54:52', '2026-02-24 16:54:52', '{\"duties\":[]}'),
('7d799213-e82b-4c0d-b09e-4dd044c773fe', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, '2026-02-24 16:35:38', '2026-02-24 16:35:38', '{\"duties\":[]}'),
('8823f275-83db-4541-b112-12bd9ed26204', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, '2026-02-24 16:57:44', '2026-02-24 16:57:44', '{\"duties\":[]}'),
('89d32118-42ff-4a73-b897-b02918d3d1c1', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, '2026-02-24 16:40:58', '2026-02-24 16:40:58', '{\"duties\":[]}'),
('8b05a40e-69a8-471c-a5d1-5be03955bf35', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', '????????????', '????????? ?.1', '2026-02-24 16:18:09', '2026-02-24 16:18:09', NULL),
('999eacf2-2b8c-41de-a536-4f6294e460ca', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, '2026-02-24 16:28:23', '2026-02-24 16:28:23', '{\"duties\":[]}'),
('9cc5a52f-b305-4cdf-9cc9-baaa3eafa505', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, '2026-02-24 16:20:35', '2026-02-24 16:20:35', '{\"test\":1}'),
('a0dc143f-2533-413d-b2c3-12fea2afb3fc', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, '2026-02-24 16:43:44', '2026-02-24 16:43:44', '{\"duties\":[]}'),
('a6496c45-f0f6-4578-8a61-f5527c2ad5e1', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, '2026-02-24 16:59:44', '2026-02-24 16:59:44', '{\"duties\":[]}'),
('bf706c80-e444-48bb-a37e-5dfcea9336ad', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, '2026-02-24 16:49:35', '2026-02-24 16:49:35', '{\"duties\":[]}'),
('d44258d9-a697-4987-aadf-842e2cf825be', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, '2026-02-24 16:56:12', '2026-02-24 16:56:12', '{\"duties\":[]}'),
('e12f23c3-a293-47bb-bd25-fbeb52d0c853', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, '2026-02-24 16:42:20', '2026-02-24 16:42:20', '{\"duties\":[]}'),
('e21004d8-497f-49cc-888b-0ed9d1f89aaf', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, '2026-02-24 16:47:25', '2026-02-24 16:47:25', '{\"duties\":[]}'),
('f72d700f-c09c-415b-a344-68da3285aa70', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, '2026-02-24 16:32:27', '2026-02-24 16:32:27', '{\"duties\":[]}');

-- --------------------------------------------------------

--
-- Table structure for table `project_activity`
--

CREATE TABLE `project_activity` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `academic_year` varchar(10) DEFAULT NULL,
  `project_name` varchar(255) DEFAULT NULL,
  `role` varchar(100) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `details` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `project_activity`
--

INSERT INTO `project_activity` (`id`, `user_id`, `academic_year`, `project_name`, `role`, `status`, `created_at`, `updated_at`, `details`) VALUES
('8b434726-a4f8-4c2d-a13e-cad0fd7886b7', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, NULL, '2026-02-24 16:20:35', '2026-02-24 16:20:35', '{\"test\":1}');

-- --------------------------------------------------------

--
-- Table structure for table `scout_qualification`
--

CREATE TABLE `scout_qualification` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `qualification` varchar(255) DEFAULT NULL,
  `received_date` date DEFAULT NULL,
  `institution` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `academic_year` varchar(10) DEFAULT NULL,
  `details` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `scout_qualification`
--

INSERT INTO `scout_qualification` (`id`, `user_id`, `qualification`, `received_date`, `institution`, `created_at`, `updated_at`, `academic_year`, `details`) VALUES
('188adb04-f67e-48b0-a28b-aa64b82c0958', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'Scout Profile', NULL, NULL, '2026-02-24 17:06:50', '2026-02-24 17:06:50', '2567', '{\"academic_year\":\"2567\",\"scout_status\":\"basic\",\"cub\":[\"CWB\"],\"scout\":[\"BTC\",\"ATC\",\"SWB\"],\"senior\":[\"BTC\",\"ATC\",\"SSWB\"],\"instructor\":[\"ALT\",\"LTC\",\"L.T\"],\"girl_guide_status\":\"none\",\"work_history\":[{\"start_date\":\"2026-02-25\",\"end_date\":\"\",\"is_current\":true,\"position\":\"sa\"}]}'),
('553fc82e-1458-4231-bd3e-cfaa066fd876', '5f7f11a3-5a42-4096-9187-38ca90c1be04', NULL, NULL, NULL, '2026-02-24 16:26:23', '2026-02-24 16:26:23', '2567', '{}'),
('654a05df-9d40-413e-970e-59cb0dfd047c', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'Scout Profile', NULL, NULL, '2026-02-24 17:06:37', '2026-02-24 17:06:37', '2567', '{\"academic_year\":\"2567\",\"scout_status\":\"none\",\"cub\":[],\"scout\":[],\"senior\":[],\"instructor\":[],\"girl_guide_status\":\"none\",\"work_history\":[{\"start_date\":\"2026-02-25\",\"end_date\":\"\",\"is_current\":true,\"position\":\"sa\"}]}'),
('8ef4843f-d880-498f-9d46-ac6fae3d802a', '5f7f11a3-5a42-4096-9187-38ca90c1be04', NULL, NULL, NULL, '2026-02-24 16:28:23', '2026-02-24 16:28:23', '2567', '{}'),
('d7750ba4-8691-489b-a54d-1259fc716db8', '5f7f11a3-5a42-4096-9187-38ca90c1be04', NULL, NULL, NULL, '2026-02-24 16:28:10', '2026-02-24 16:28:10', '2567', '{}');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `token` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `role` varchar(50) DEFAULT NULL,
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`token`, `user_id`, `role`, `expires_at`, `created_at`) VALUES
('056ffd6d-2831-4c88-a152-a910bf894324', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'admin', '2026-02-25 16:10:54', '2026-02-24 16:10:54'),
('0af20306-6ed8-49a2-b1dd-dd07a060d2e1', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'admin', '2026-02-25 16:15:22', '2026-02-24 16:15:22'),
('0b43d047-dd88-4745-9279-d3d19694e3b5', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'admin', '2026-02-25 16:26:23', '2026-02-24 16:26:23'),
('0d0175a4-d0b6-4972-ac84-879eb3683ac8', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'admin', '2026-02-25 16:17:34', '2026-02-24 16:17:34'),
('0e9f97b5-e791-4150-92dc-932b9439668f', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'admin', '2026-02-25 15:56:09', '2026-02-24 15:56:09'),
('17d5259b-6e23-425c-8ab4-41ef7281b27e', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'admin', '2026-02-25 15:56:18', '2026-02-24 15:56:18'),
('18853951-93e8-4ba2-8077-4c3f7e4a4455', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'admin', '2026-02-25 16:50:28', '2026-02-24 16:50:28'),
('1ae58b92-a75d-4503-b3c1-9f164c717b5a', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'admin', '2026-02-25 16:37:34', '2026-02-24 16:37:34'),
('1bdef5f1-c752-4aa5-b858-509557253a28', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'admin', '2026-02-25 15:34:56', '2026-02-24 15:34:56'),
('1f68f214-e29b-4ce6-b8d3-4567465ce02a', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'admin', '2026-02-25 16:12:03', '2026-02-24 16:12:03'),
('2bcc5ed7-ceba-4c38-8065-84222d3c647c', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'admin', '2026-02-25 16:35:38', '2026-02-24 16:35:38'),
('2c01d08c-cf7c-45ab-baa9-212e900db83c', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'admin', '2026-02-25 16:14:22', '2026-02-24 16:14:22'),
('3a97c9eb-6434-445a-ba45-12f698710c52', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'admin', '2026-02-25 15:43:34', '2026-02-24 15:43:34'),
('495e9186-2065-46fe-9c4f-7600d99b09e1', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'admin', '2026-02-25 16:17:07', '2026-02-24 16:17:07'),
('5157dada-0aac-41f6-9f57-a9ab79645342', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'admin', '2026-02-25 16:14:22', '2026-02-24 16:14:22'),
('56a935af-0ce6-490c-bd65-226a74bcfb8d', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'admin', '2026-02-25 16:20:34', '2026-02-24 16:20:34'),
('5bae8f59-6807-4ee9-b307-297c8805d5f8', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'admin', '2026-02-25 16:12:27', '2026-02-24 16:12:27'),
('61c7cfc6-4e78-4fcf-bdb9-50a93c1966b7', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'admin', '2026-02-25 16:49:35', '2026-02-24 16:49:35'),
('641ae407-cba6-48f3-b3bd-af3a630cc4d2', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'admin', '2026-02-25 15:56:18', '2026-02-24 15:56:18'),
('64f19fca-08c7-4e00-92fb-47c589084c0f', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'admin', '2026-02-25 16:42:20', '2026-02-24 16:42:20'),
('6580c100-098c-4120-aec0-a90096358972', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'admin', '2026-02-25 15:34:42', '2026-02-24 15:34:42'),
('6ba12be3-ef1b-4f4b-ac0a-11ef6eb30479', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'admin', '2026-02-25 15:45:40', '2026-02-24 15:45:40'),
('717c1c0a-e48f-4eb6-b783-9b65aab5aeaf', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'admin', '2026-02-25 16:34:33', '2026-02-24 16:34:33'),
('71d1e3ab-a884-4658-936b-915333e52e58', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'admin', '2026-02-25 16:17:35', '2026-02-24 16:17:35'),
('734b09f8-4297-4e61-b272-b0bf88691c45', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'admin', '2026-02-25 16:12:43', '2026-02-24 16:12:43'),
('75aba12a-892d-427a-8857-9a9e524f497d', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'admin', '2026-02-25 16:00:49', '2026-02-24 16:00:49'),
('7a19b730-3e0f-4fa3-b318-3f458f7d7e49', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'admin', '2026-02-25 16:10:03', '2026-02-24 16:10:03'),
('7df6132a-37cb-4ccd-bb0f-fb1f6544527f', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'admin', '2026-02-25 15:56:09', '2026-02-24 15:56:09'),
('83e59451-1d4c-47f8-b3b2-c2f5f544051c', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'admin', '2026-02-25 16:28:23', '2026-02-24 16:28:23'),
('86953d9d-9af8-48f3-988d-c6c1b4518068', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'admin', '2026-02-25 16:56:11', '2026-02-24 16:56:11'),
('894c8788-ae16-48b9-9809-2f7677e4c2ac', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'admin', '2026-02-25 16:17:08', '2026-02-24 16:17:08'),
('8ea63c15-549d-47e6-94dc-84ead2d47c99', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'admin', '2026-02-25 16:32:27', '2026-02-24 16:32:27'),
('8f4bb464-3df7-4e1f-876d-adda8ae5fda5', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'admin', '2026-02-25 16:18:09', '2026-02-24 16:18:09'),
('9657f7e6-7efe-484c-9c3d-07e55f4ffdfe', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'admin', '2026-02-25 16:12:27', '2026-02-24 16:12:27'),
('9774f8ad-0221-4957-97b2-543c8601954a', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'admin', '2026-02-25 16:28:10', '2026-02-24 16:28:10'),
('97dccaa8-0ebf-439f-8115-b7d29ac9649f', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'admin', '2026-02-25 16:30:48', '2026-02-24 16:30:48'),
('99b73c30-69c0-4888-a1f5-8fe0e255c8f7', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'admin', '2026-02-25 16:57:44', '2026-02-24 16:57:44'),
('9dd8aba6-068f-4400-9002-33c55aa259e1', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'admin', '2026-02-25 16:21:34', '2026-02-24 16:21:34'),
('a4ebf881-e7c4-4ab8-a0eb-39fee6524522', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'admin', '2026-02-25 15:36:54', '2026-02-24 15:36:54'),
('a5a9c5df-97e6-4181-966f-c0cc912d93e3', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'admin', '2026-02-25 17:05:50', '2026-02-24 17:05:50'),
('a7d39271-08a3-4fc4-af06-2c5f0e24dd50', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'admin', '2026-02-25 16:54:52', '2026-02-24 16:54:52'),
('ae3ecb5a-ea6c-4325-ad19-5180f061a1c4', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'admin', '2026-02-25 15:35:39', '2026-02-24 15:35:39'),
('b0ce3e7d-99ab-47a1-ac51-261d62b182d0', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'admin', '2026-02-25 16:40:58', '2026-02-24 16:40:58'),
('b375228d-79ed-4b0f-93cd-145ac9d9c726', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'admin', '2026-02-25 16:07:28', '2026-02-24 16:07:28'),
('b8929aaa-7af1-4ae2-99f6-25f3e5af6f62', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'admin', '2026-02-25 15:41:10', '2026-02-24 15:41:10'),
('b9a5d754-0a3e-4cb0-9069-2c8bd9c3fb56', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'admin', '2026-02-25 16:59:44', '2026-02-24 16:59:44'),
('c5b6824a-3fe8-4914-a911-f3002304a8a4', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'admin', '2026-02-25 16:15:29', '2026-02-24 16:15:29'),
('c67d23cc-0901-4374-ac50-a82d8750893a', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'admin', '2026-02-25 16:15:22', '2026-02-24 16:15:22'),
('cafdab87-892d-45e4-bd20-20dc992180cb', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'admin', '2026-02-25 16:47:25', '2026-02-24 16:47:25'),
('cb3638c2-9bf2-46ff-8e5b-f55cb8cf53eb', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'admin', '2026-02-25 15:36:09', '2026-02-24 15:36:09'),
('cc61efdc-fd16-499a-aa0d-f6b461cc8a65', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'admin', '2026-02-25 16:00:49', '2026-02-24 16:00:49'),
('eceee954-08d2-4def-9e22-7c58b18e52d8', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'admin', '2026-02-25 16:43:43', '2026-02-24 16:43:43'),
('f780c8b3-a783-442c-ab25-dd400f290652', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'admin', '2026-02-25 16:20:35', '2026-02-24 16:20:35'),
('f7f6b72b-4d71-4c81-b26e-b5e44f6b407c', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'admin', '2026-02-25 15:44:44', '2026-02-24 15:44:44'),
('fcea7cde-6e0b-49ae-b742-716523714f70', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'admin', '2026-02-25 16:18:09', '2026-02-24 16:18:09'),
('fe1a017e-5e9d-4611-85cb-e0b3606040b3', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'admin', '2026-02-25 16:12:43', '2026-02-24 16:12:43'),
('fedf36ee-f2c0-4b6b-aa86-8a8b908d4ba7', '5f7f11a3-5a42-4096-9187-38ca90c1be04', 'admin', '2026-02-25 15:35:44', '2026-02-24 15:35:44');

-- --------------------------------------------------------

--
-- Table structure for table `student_activity`
--

CREATE TABLE `student_activity` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `academic_year` varchar(10) DEFAULT NULL,
  `activity_name` varchar(255) DEFAULT NULL,
  `grade_level` varchar(50) DEFAULT NULL,
  `hours_per_term` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `details` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `student_activity`
--

INSERT INTO `student_activity` (`id`, `user_id`, `academic_year`, `activity_name`, `grade_level`, `hours_per_term`, `created_at`, `updated_at`, `details`) VALUES
('71d87375-49b9-4aff-bb72-d853b6be32f6', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, NULL, '2026-02-24 16:20:35', '2026-02-24 16:20:35', '{\"test\":1}');

-- --------------------------------------------------------

--
-- Table structure for table `teaching_summary`
--

CREATE TABLE `teaching_summary` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `academic_year` varchar(10) DEFAULT NULL,
  `term` varchar(10) DEFAULT NULL,
  `subject_code` varchar(50) DEFAULT NULL,
  `subject_name` varchar(255) DEFAULT NULL,
  `grade_level` varchar(50) DEFAULT NULL,
  `hours_per_week` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `details` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `teaching_summary`
--

INSERT INTO `teaching_summary` (`id`, `user_id`, `academic_year`, `term`, `subject_code`, `subject_name`, `grade_level`, `hours_per_week`, `created_at`, `updated_at`, `details`) VALUES
('0fa18977-abb4-440b-a3ed-e95d5c9b67fe', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, NULL, NULL, NULL, '2026-02-24 16:56:12', '2026-02-24 16:56:12', '{\"s1\":[]}'),
('44f62201-0ccf-4c63-bdac-a301a7d7a5ef', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, NULL, NULL, NULL, '2026-02-24 16:59:44', '2026-02-24 16:59:44', '{\"s1\":[]}'),
('4c53a324-97cf-4373-9f1e-7f8890fa8375', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, NULL, NULL, NULL, '2026-02-24 16:50:28', '2026-02-24 16:50:28', '{\"s1\":[]}'),
('4d741d92-a972-4608-a098-d8e6116078d7', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, NULL, NULL, NULL, '2026-02-24 16:32:27', '2026-02-24 16:32:27', '{\"s1\":[]}'),
('56858f7e-36d4-442e-be14-b1ddb5064fb2', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, NULL, NULL, NULL, '2026-02-24 16:54:52', '2026-02-24 16:54:52', '{\"s1\":[]}'),
('66303a99-3898-4a72-90e0-b4317305afb3', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, NULL, NULL, NULL, '2026-02-24 16:40:58', '2026-02-24 16:40:58', '{\"s1\":[]}'),
('691e6819-bd91-4af2-bbf4-ef5439e045f0', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, NULL, NULL, NULL, '2026-02-24 16:26:23', '2026-02-24 16:26:23', '{\"semester1\":[]}'),
('6f943f3b-e978-4116-a275-8aec72eecc1d', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, NULL, NULL, NULL, '2026-02-24 16:35:38', '2026-02-24 16:35:38', '{\"s1\":[]}'),
('7fea0d2c-97b1-4344-a22e-5501af8661aa', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, NULL, NULL, NULL, '2026-02-24 16:28:23', '2026-02-24 16:28:23', '{\"semester1\":[]}'),
('8dffa7ef-454c-4d14-a819-20912d0146cd', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, NULL, NULL, NULL, '2026-02-24 16:43:44', '2026-02-24 16:43:44', '{\"s1\":[]}'),
('9c6ceefb-d4fa-4375-b240-c2d718599ea0', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, NULL, NULL, NULL, '2026-02-24 16:34:33', '2026-02-24 16:34:33', '{\"s1\":[]}'),
('a12c9603-3ed3-4000-b048-6fdf69fd312d', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, NULL, NULL, NULL, '2026-02-24 16:42:20', '2026-02-24 16:42:20', '{\"s1\":[]}'),
('ae76e5ba-7a3f-4ffa-bab8-d55e5b855b2c', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, NULL, NULL, NULL, '2026-02-24 16:57:44', '2026-02-24 16:57:44', '{\"s1\":[]}'),
('bcd936f3-e3bc-4242-8269-f8304f95aabe', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, NULL, NULL, NULL, '2026-02-24 16:30:48', '2026-02-24 16:30:48', '{\"s1\":[]}'),
('c4ba6e0c-4458-45bb-afa0-093344282d59', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, NULL, NULL, NULL, '2026-02-24 16:47:25', '2026-02-24 16:47:25', '{\"s1\":[]}'),
('c51875d5-fecd-4115-a553-3fbcd14040e2', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, NULL, NULL, NULL, '2026-02-24 16:37:34', '2026-02-24 16:37:34', '{\"s1\":[]}'),
('cdd6eb24-99ec-4281-8221-7b7d56530737', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, NULL, NULL, NULL, '2026-02-24 16:28:10', '2026-02-24 16:28:10', '{\"semester1\":[]}'),
('e4015b25-fd35-41f5-abe7-5801c227825a', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, NULL, NULL, NULL, '2026-02-24 16:49:35', '2026-02-24 16:49:35', '{\"s1\":[]}'),
('fa0f51ad-8020-4d38-b9cd-a1efc65ef23c', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', '1', '?21101', '??????????', '?.1', 3, '2026-02-24 16:18:09', '2026-02-24 16:18:09', NULL),
('fa7b6327-1a2c-4925-b401-554a77bf619c', '5f7f11a3-5a42-4096-9187-38ca90c1be04', '2567', NULL, NULL, NULL, NULL, NULL, '2026-02-24 16:20:35', '2026-02-24 16:20:35', '{\"test\":1}');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(36) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','staff','executive','head','user') DEFAULT 'user',
  `name` varchar(255) NOT NULL,
  `name_en` varchar(255) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `position` varchar(100) DEFAULT NULL,
  `grade_level` varchar(100) DEFAULT NULL,
  `profile_image` text DEFAULT NULL,
  `active` tinyint(1) DEFAULT 1,
  `last_login` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role`, `name`, `name_en`, `email`, `phone`, `position`, `grade_level`, `profile_image`, `active`, `last_login`, `created_at`, `updated_at`) VALUES
('4cfde037-b99f-433a-af0f-02915e8ba02f', 'staff', '$2b$10$uoSlci/WpWZ892VpZ5SvsucDCxCPPlqvF6Ho9bAWrofVVqsVH8u8i', 'staff', 'เจ้าหน้าที่', 'Staff', NULL, NULL, NULL, NULL, NULL, 1, NULL, '2026-02-24 15:34:14', '2026-02-24 15:34:14'),
('5f7f11a3-5a42-4096-9187-38ca90c1be04', 'admin', '$2b$10$xd0SzrpD/KJudUKpWoR2gOH2fzH.S8/zCpbgRm50SH2zIYL6Gq9MK', 'admin', 'ผู้ดูแลระบบ', 'Administrator', NULL, NULL, NULL, NULL, NULL, 1, '2026-02-24 17:05:50', '2026-02-24 15:34:14', '2026-02-24 17:05:50');

-- --------------------------------------------------------

--
-- Table structure for table `work_history`
--

CREATE TABLE `work_history` (
  `id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `position` varchar(255) DEFAULT NULL,
  `level` varchar(100) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `workplace` varchar(255) DEFAULT NULL,
  `salary` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `academic_year` varchar(10) DEFAULT NULL,
  `details` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `awards`
--
ALTER TABLE `awards`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `competition`
--
ALTER TABLE `competition`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `config`
--
ALTER TABLE `config`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `duty_assignments`
--
ALTER TABLE `duty_assignments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `schedule_id` (`schedule_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `duty_locations`
--
ALTER TABLE `duty_locations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `duty_schedules`
--
ALTER TABLE `duty_schedules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `location_id` (`location_id`);

--
-- Indexes for table `education`
--
ALTER TABLE `education`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `field_trip`
--
ALTER TABLE `field_trip`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `media_production`
--
ALTER TABLE `media_production`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `media_usage`
--
ALTER TABLE `media_usage`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `meetings`
--
ALTER TABLE `meetings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `meeting_attendees`
--
ALTER TABLE `meeting_attendees`
  ADD PRIMARY KEY (`meeting_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `personal_info`
--
ALTER TABLE `personal_info`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `position_duty`
--
ALTER TABLE `position_duty`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `project_activity`
--
ALTER TABLE `project_activity`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `scout_qualification`
--
ALTER TABLE `scout_qualification`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`token`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `student_activity`
--
ALTER TABLE `student_activity`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `teaching_summary`
--
ALTER TABLE `teaching_summary`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `work_history`
--
ALTER TABLE `work_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD CONSTRAINT `audit_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `awards`
--
ALTER TABLE `awards`
  ADD CONSTRAINT `awards_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `competition`
--
ALTER TABLE `competition`
  ADD CONSTRAINT `competition_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `duty_assignments`
--
ALTER TABLE `duty_assignments`
  ADD CONSTRAINT `duty_assignments_ibfk_1` FOREIGN KEY (`schedule_id`) REFERENCES `duty_schedules` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `duty_assignments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `duty_schedules`
--
ALTER TABLE `duty_schedules`
  ADD CONSTRAINT `duty_schedules_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `duty_schedules_ibfk_2` FOREIGN KEY (`location_id`) REFERENCES `duty_locations` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `education`
--
ALTER TABLE `education`
  ADD CONSTRAINT `education_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `field_trip`
--
ALTER TABLE `field_trip`
  ADD CONSTRAINT `field_trip_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `media_production`
--
ALTER TABLE `media_production`
  ADD CONSTRAINT `media_production_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `media_usage`
--
ALTER TABLE `media_usage`
  ADD CONSTRAINT `media_usage_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `meetings`
--
ALTER TABLE `meetings`
  ADD CONSTRAINT `meetings_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `meeting_attendees`
--
ALTER TABLE `meeting_attendees`
  ADD CONSTRAINT `meeting_attendees_ibfk_1` FOREIGN KEY (`meeting_id`) REFERENCES `meetings` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `meeting_attendees_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `personal_info`
--
ALTER TABLE `personal_info`
  ADD CONSTRAINT `personal_info_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `position_duty`
--
ALTER TABLE `position_duty`
  ADD CONSTRAINT `position_duty_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `project_activity`
--
ALTER TABLE `project_activity`
  ADD CONSTRAINT `project_activity_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `scout_qualification`
--
ALTER TABLE `scout_qualification`
  ADD CONSTRAINT `scout_qualification_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sessions`
--
ALTER TABLE `sessions`
  ADD CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `student_activity`
--
ALTER TABLE `student_activity`
  ADD CONSTRAINT `student_activity_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `teaching_summary`
--
ALTER TABLE `teaching_summary`
  ADD CONSTRAINT `teaching_summary_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `work_history`
--
ALTER TABLE `work_history`
  ADD CONSTRAINT `work_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
