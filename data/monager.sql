-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jun 06, 2019 at 07:07 AM
-- Server version: 10.1.36-MariaDB
-- PHP Version: 7.2.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `monager`
--

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `catID` int(11) NOT NULL,
  `catName` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`catID`, `catName`) VALUES
(1, 'Food'),
(2, 'Clothing'),
(3, 'Skincare'),
(4, 'Petrol'),
(5, 'Pay Check'),
(6, 'Allowance'),
(7, 'Makeup'),
(9, 'Other'),
(10, ''),
(11, 'Cash Withdrawal'),
(12, 'Money Transfer');

-- --------------------------------------------------------

--
-- Table structure for table `expenses`
--

CREATE TABLE `expenses` (
  `id` int(11) NOT NULL,
  `email` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `amount` float NOT NULL,
  `category` int(11) NOT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `expenses`
--

INSERT INTO `expenses` (`id`, `email`, `name`, `amount`, `category`, `date`) VALUES
(1, 1, 'Clothes shopping', 100, 2, '2019-04-23'),
(2, 1, 'Makeup', 67.53, 7, '2019-06-03'),
(3, 1, 'Eyeliner', 30, 7, '2019-06-05'),
(4, 1, 'Oreo Ice Cream', 4.5, 1, '2019-05-24'),
(8, 1, 'Oreo Ice Cream', 4.5, 1, '2019-05-27'),
(9, 1, 'Face serum', 71.65, 3, '2019-05-25'),
(11, 1, 'Dinner', 45, 1, '2019-06-04'),
(13, 4, 'Test', 20, 1, '2019-06-04'),
(16, 1, 'Face cleasner', 40, 3, '2019-04-22'),
(17, 1, 'Cash withdrawal', 50, 11, '2019-04-27'),
(18, 1, 'Clothes & accessories', 109.65, 2, '2019-04-27'),
(19, 1, 'Lipstick', 66.8, 7, '2019-05-01'),
(20, 1, 'Buy earrings', 7.68, 2, '2019-05-12'),
(21, 1, 'Raya clothes', 176.33, 2, '2019-05-13'),
(22, 1, 'Face serum', 81, 3, '2019-05-17'),
(23, 1, 'Makeup', 29.7, 7, '2019-01-23'),
(24, 1, 'Buy metal straw', 10, 9, '2019-02-11'),
(26, 1, 'Lunch', 10, 1, '2019-03-05'),
(27, 1, 'Lunch', 10, 1, '2019-03-04'),
(28, 1, 'Lunch', 10, 1, '2019-03-06'),
(29, 1, 'Lunch', 10, 1, '2019-03-07'),
(30, 1, 'Lunch', 10, 1, '2019-03-08'),
(31, 1, 'Lunch', 10, 1, '2019-03-11'),
(32, 1, 'Lunch', 10, 1, '2019-03-12'),
(33, 1, 'Lunch', 10, 1, '2019-03-13'),
(34, 1, 'Lunch', 10, 1, '2019-03-14'),
(35, 1, 'Lunch', 10, 1, '2019-03-15'),
(36, 1, 'Lunch', 10, 1, '2019-03-18'),
(37, 1, 'Lunch', 10, 1, '2019-03-19'),
(38, 1, 'Lunch', 10, 1, '2019-03-20'),
(39, 1, 'Lunch', 10, 1, '2019-03-21'),
(40, 1, 'Lunch', 10, 1, '2019-03-22'),
(41, 1, 'Lunch', 10, 1, '2019-03-25'),
(42, 1, 'Lunch', 10, 1, '2019-03-26'),
(43, 1, 'Lunch', 10, 1, '2019-03-27'),
(44, 1, 'Lunch', 10, 1, '2019-03-28'),
(45, 1, 'Lunch', 10, 1, '2019-03-29'),
(46, 1, 'Lunch 1 - 5 April', 50, 1, '2019-04-01'),
(47, 1, 'Lunch 8 - 12 April', 50, 1, '2019-04-08'),
(48, 1, 'Lunch 15 - 19 April', 50, 1, '2019-04-15'),
(49, 1, 'Lunch 22 - 26 April', 50, 1, '2019-04-22');

-- --------------------------------------------------------

--
-- Table structure for table `income`
--

CREATE TABLE `income` (
  `id` int(11) NOT NULL,
  `email` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `amount` float NOT NULL,
  `category` int(11) NOT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `income`
--

INSERT INTO `income` (`id`, `email`, `name`, `amount`, `category`, `date`) VALUES
(1, 1, 'Pay Check', 1400, 5, '2019-04-22'),
(2, 1, 'Weekly Allowance', 50, 6, '2019-03-04'),
(3, 1, 'Weekly Allowance', 50, 6, '2019-03-11'),
(4, 1, 'Initial Bank Balance', 419.89, 9, '2019-01-25'),
(5, 4, 'Initial Bank Balance', 1000, 9, '2019-06-04'),
(6, 1, 'Money Transfer', 36, 12, '2019-05-01'),
(7, 1, 'Money Transfer', 100, 12, '2019-05-14'),
(8, 1, 'Weekly Allowance', 50, 6, '2019-03-18'),
(9, 1, 'Weekly Allowance', 50, 6, '2019-03-25'),
(10, 1, 'Weekly Allowance', 50, 6, '2019-04-01'),
(11, 1, 'Weekly Allowance', 50, 6, '2019-04-08'),
(12, 1, 'Duit raya', 50, 9, '2019-06-05'),
(13, 1, 'Weekly Allowance', 50, 6, '2019-04-15'),
(14, 1, 'Weekly Allowance', 50, 6, '2019-04-22'),
(15, 1, 'Weekly Allowance', 50, 6, '2019-04-29'),
(16, 1, 'Weekly Allowance', 50, 6, '2019-05-06'),
(17, 1, 'Weekly Allowance', 50, 6, '2019-05-13'),
(18, 1, 'Weekly Allowance', 50, 6, '2019-05-20'),
(19, 1, 'Weekly Allowance', 35, 6, '2019-05-27');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `fullName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `dailyLimit` decimal(10,2) NOT NULL,
  `accType` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `fullName`, `email`, `password`, `dailyLimit`, `accType`) VALUES
(1, 'Almira Putri Sandy', 'user@gmail.com', 'abc123$%', '300.00', 'Business'),
(4, 'Almira Putri Sandy', 'putrialmira@gmail.com', 'abc123$%', '200.00', 'Personal');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`catID`);

--
-- Indexes for table `expenses`
--
ALTER TABLE `expenses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `email` (`email`),
  ADD KEY `expCategory` (`category`);

--
-- Indexes for table `income`
--
ALTER TABLE `income`
  ADD PRIMARY KEY (`id`),
  ADD KEY `email` (`email`),
  ADD KEY `incCategory` (`category`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `catID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `expenses`
--
ALTER TABLE `expenses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT for table `income`
--
ALTER TABLE `income`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `expenses`
--
ALTER TABLE `expenses`
  ADD CONSTRAINT `expenses_ibfk_1` FOREIGN KEY (`email`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `expenses_ibfk_2` FOREIGN KEY (`category`) REFERENCES `category` (`catID`);

--
-- Constraints for table `income`
--
ALTER TABLE `income`
  ADD CONSTRAINT `income_ibfk_1` FOREIGN KEY (`email`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `income_ibfk_2` FOREIGN KEY (`category`) REFERENCES `category` (`catID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
