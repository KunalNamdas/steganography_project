# Secure Steganography Project

This project implements a secure steganography system using Node.js and Docker. The system allows embedding secret images into carrier images and extracting them using a web interface.

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [Jenkins Pipeline](#jenkins-pipeline)
- [Docker Deployment](#docker-deployment)

## Project Overview

Steganography is the practice of hiding secret information within another medium. This project focuses on embedding and extracting images using Least Significant Bit (LSB) substitution and AES encryption for added security.

## Features

- Embed secret images into carrier images.
- Extract secret images from steganography images.
- AES encryption for secure embedding.
- User-friendly web interface.

## Requirements

- Node.js
- Docker
- Jenkins

## Installation

### Clone the Repository

```sh
git clone https://github.com/KunalNamdas/steganography_project.git
cd steganography_project

**
## Install Dependencies**
npm install

Run This Project
node service.js
