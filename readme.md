# JavaBin
![NPM VERSION](https://img.shields.io/npm/v/javabin?style=flat)
![DOWNLOADS](https://img.shields.io/npm/dm/javabin.svg?style=flat)
![LICENSE](https://img.shields.io/npm/l/javabin)
![BUILD](https://img.shields.io/github/actions/workflow/status/FotoSave/javabin/node.yml?branch=master)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/be5fbbf3bc2e4607b80c11785defb184)](https://www.codacy.com/gh/FotoSave/javabin/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=FotoSave/javabin&amp;utm_campaign=Badge_Grade)
[![Codacy Badge](https://app.codacy.com/project/badge/Coverage/be5fbbf3bc2e4607b80c11785defb184)](https://www.codacy.com/gh/FotoSave/javabin/dashboard?utm_source=github.com&utm_medium=referral&utm_content=FotoSave/javabin&utm_campaign=Badge_Coverage)

JavaBin is a library that can be used to download all Amazon Corretto resources from Node.js.

**Table of Contents:**


- [JavaBin](#javabin)
  - [Documentation](#documentation)
    - [Install](#install)
    - [Getting Started](#getting-started)
    - [JavaVersion Class](#javaversion-class)
      - [List Platforms](#list-platforms)
      - [List Architectures of Platform](#list-architectures-of-platform)
      - [List Architectures](#list-architectures)
    - [Get Platform](#get-platform)
    - [Platform Class](#platform-class)
      - [List JRE versions](#list-jre-versions)
      - [List JDK versions](#list-jdk-versions)
      - [List Versions](#list-versions)
      - [Get JRE version](#get-jre-version)
      - [Get JDK version](#get-jdk-version)
    - [JavaBinariesFomarts Class](#javabinariesfomarts-class)
      - [List Formats](#list-formats)
      - [Get JavaBinary for format](#get-javabinary-for-format)
    - [JavaBinary class](#javabinary-class)
      - [GetDownloadURL](#getdownloadurl)
      - [Download](#download)
    - [IncomingDownload](#incomingdownload)
      - [Events](#events)
        - [Start](#start)
        - [Tick](#tick)
        - [Complete](#complete)


## Documentation

### Install

To add this librery to your proyect use this command.

```bash
npm i javabin
```

If you want use the CLI use this command.

```bash
npm i -g javabin
```

*To get help of javabin CLI use command `javabin -h`*.

### Getting Started

To use this librery you need to import it frist.

```ts
import JavaBin from "javabin";

// or

const JavaBin = require("javabin");
```

and before get an instance.

```ts
const JavaVersion = JavaBin.getInstance(); // Returns Promise<JavaVersion>
```

_The method `getInstance` request all data from the oficial github of Amazon Corretto._

### JavaVersion Class

#### List Platforms

If you want list all platforms available you can use this method.

```ts
JavaVersion.listPlatforms();
```

_This method returns array all platforms._

#### List Architectures of Platform

**Parameters:**

- platform: _The name of the platform from which you want to obtain its architectures._

**Returns:**

_It method returns an array with all architectures._

```ts
JavaVersion.getPlatformArchs("windows");
```

#### List Architectures

_This method list all platforms with their respective architectures._

**Returns:**

_This method returns an object with each platform in the keys and in each one an array with its possible architectures._

_Example:_

```json
{
    "windows": ["x64", "x86"],
    "linux": ["x64", "x86", "arm"],
    ...
}
```

```ts
JavaVersion.listArchs();
```

### Get Platform

**Parameters:**

- Platform: *The name of platform*.
- Arch: *The architecture you need.*

**Returns:**

*This method return an Platform class instance.*

```ts
JavaVersion.platform("linux","x64");
```

### Platform Class

#### List JRE versions

*This method list all JRE versions that are available.*

```ts
JavaVersion.platform("linux", "x64").listJreVersions();
```

#### List JDK versions

*This method list all JDK versions that are available.*

```ts
JavaVersion.platform("linux", "x64").listJdkVersions();
```

#### List Versions

*This method list all versions that are available.*

**Returns:**

*An object with two keys (JRE, JDK) and in each of its available versions.*

**Example:**

```json
{
    "jdk": ["8", "11"...],
    "jre": ["8", "11"...]
}
```

```ts
JavaVersion.platform("linux", "x64").listVersions();
```

#### Get JRE version

*To get an JRE version you can use this method.*

**Parameters:**

- Version: *The version you want get.*

**Returns:**

*This method return an instance of JavaBinariesFormats.*

```ts
JavaVersion.platform("windows","x64").jre(8);
```

#### Get JDK version

*To get an JDK version you can use this method.*

**Parameters:**

- Version: *The version you want get.*

**Returns:**

*This method return an instance of JavaBinariesFormats.*

```ts
JavaVersion.platform("windows","x64").jdk(11);
```

### JavaBinariesFomarts Class

This class is used to select the format of JavaBinary.

#### List Formats

*This method is used to list all formats for JavaBinary*.

**Returns:**

*Returns array with all formats.*

**Example:**

```json
[
    "zip", "msi", "exe"...
]
```

```ts
JavaVersion.platform("win", "x64").jdk(11).listFormats();
```

#### Get JavaBinary for format

*This method is used to get an format for JavaVersion*.

**Returns:**

*Returns an instance of JavaBinary.*

```ts
JavaVersion.platform("win", "x64").jdk(11).format("zip");
```

### JavaBinary class

#### GetDownloadURL

Method **getDownloadUrl**:

*This method returns the download url for the JavaBinary.*

#### Download

Method **download**:

*This method download return an IncomingDownload.*

**Parameters:**

- downloadPath `optional`: *The path where the binary is downloaded.* If you not specify an path will be downloaded in the current working directory.

### IncomingDownload

#### Events

##### Start

This event is triggered when the download starts.

**Callback value:**

Object:

```json
{
    "total": 100,
    "javaBin": {...} // JavaBinary instance
}
```

##### Tick

This event is triggered when the download process advances.

**Callback value:**

Object:

```json
{
    "total": 5616424,
    "tick": 15852
}
```

##### Complete

This event is triggered when the download process ends.

**Callback value:**

Object:

```json
{
    "path":"path_to_java_binary",
    "filename": "java_binary_file_name",
    "javaBinary": {...} // JavaBinary instance
}
```
