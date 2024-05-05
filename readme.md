# JavaBin

![NPM VERSION](https://img.shields.io/npm/v/javabin?style=flat) ![DOWNLOADS](https://img.shields.io/npm/dm/javabin.svg?style=flat) ![LICENSE](https://img.shields.io/npm/l/javabin) ![BUILD](https://img.shields.io/github/workflow/status/FotoSave/javabin/Node.js%20CI) [![Codacy Badge](https://app.codacy.com/project/badge/Grade/be5fbbf3bc2e4607b80c11785defb184)](https://www.codacy.com/gh/FotoSave/javabin/dashboard?utm\_source=github.com\&utm\_medium=referral\&utm\_content=FotoSave/javabin\&utm\_campaign=Badge\_Grade) [![Codacy Badge](https://app.codacy.com/project/badge/Coverage/be5fbbf3bc2e4607b80c11785defb184)](https://www.codacy.com/gh/FotoSave/javabin/dashboard?utm\_source=github.com\&utm\_medium=referral\&utm\_content=FotoSave/javabin\&utm\_campaign=Badge\_Coverage)

JavaBin is a library that can be used to download all Amazon Corretto resources from Node.js.

**Table of Contents:**

* [JavaBin](broken-reference)
  * [Documentation](broken-reference)
    * [Install](broken-reference)
    * [Getting Started](broken-reference)
    * [JavaVersion Class](broken-reference)
      * [List Platforms](broken-reference)
      * [List Architectures of Platform](broken-reference)
      * [List Architectures](broken-reference)
    * [Get Platform](broken-reference)
    * [Platform Class](broken-reference)
      * [List JRE versions](broken-reference)
      * [List JDK versions](broken-reference)
      * [List Versions](broken-reference)
      * [Get JRE version](broken-reference)
      * [Get JDK version](broken-reference)
    * [JavaBinariesFomarts Class](broken-reference)
      * [List Formats](broken-reference)
      * [Get JavaBinary for format](broken-reference)
    * [JavaBinary class](broken-reference)
      * [GetDownloadURL](broken-reference)
      * [Download](broken-reference)
    * [IncomingDownload](broken-reference)
      * [Events](broken-reference)
        * [Start](broken-reference)
        * [Tick](broken-reference)
        * [Complete](broken-reference)

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

_To get help of javabin CLI use command `javabin -h`_.

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

* platform: _The name of the platform from which you want to obtain its architectures._

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

* Platform: _The name of platform_.
* Arch: _The architecture you need._

**Returns:**

_This method return an Platform class instance._

```ts
JavaVersion.platform("linux","x64");
```

### Platform Class

#### List JRE versions

_This method list all JRE versions that are available._

```ts
JavaVersion.platform("linux", "x64").listJreVersions();
```

#### List JDK versions

_This method list all JDK versions that are available._

```ts
JavaVersion.platform("linux", "x64").listJdkVersions();
```

#### List Versions

_This method list all versions that are available._

**Returns:**

_An object with two keys (JRE, JDK) and in each of its available versions._

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

_To get an JRE version you can use this method._

**Parameters:**

* Version: _The version you want get._

**Returns:**

_This method return an instance of JavaBinariesFormats._

```ts
JavaVersion.platform("windows","x64").jre(8);
```

#### Get JDK version

_To get an JDK version you can use this method._

**Parameters:**

* Version: _The version you want get._

**Returns:**

_This method return an instance of JavaBinariesFormats._

```ts
JavaVersion.platform("windows","x64").jdk(11);
```

### JavaBinariesFomarts Class

This class is used to select the format of JavaBinary.

#### List Formats

_This method is used to list all formats for JavaBinary_.

**Returns:**

_Returns array with all formats._

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

_This method is used to get an format for JavaVersion_.

**Returns:**

_Returns an instance of JavaBinary._

```ts
JavaVersion.platform("win", "x64").jdk(11).format("zip");
```

### JavaBinary class

#### GetDownloadURL

Method **getDownloadUrl**:

_This method returns the download url for the JavaBinary._

#### Download

Method **download**:

_This method download return an IncomingDownload._

**Parameters:**

* downloadPath `optional`: _The path where the binary is downloaded._ If you not specify an path will be downloaded in the current working directory.

### IncomingDownload

#### Events

**Start**

This event is triggered when the download starts.

**Callback value:**

Object:

```json
{
    "total": 100,
    "javaBin": {...} // JavaBinary instance
}
```

**Tick**

This event is triggered when the download process advances.

**Callback value:**

Object:

```json
{
    "total": 5616424,
    "tick": 15852
}
```

**Complete**

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
