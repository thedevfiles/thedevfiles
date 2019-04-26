---
slug: managing-dependencies-with-composer
path: "/2014/09/managing-dependencies-with-composer"
title: Managing Dependencies with Composer
date: 2014-09-08 00:00:00
year: 2014
month: 09
description: Using composer to manage dependencies.
published: true
comments: true
sharing: true
image: "../assets/images/featured/logo-composer-transparent5.png"
image_width: 290
image_height: 356
categories: [User Guide]
tags: [php]
---

[Composer](http://getcomposer.org) is a package manager for PHP much like [gem](https://rubygems.org/) is for ruby or [npm](https://www.npmjs.org/) is for node.

It allows you to define libraries that your application depends on and will install them for you as well a their own dependencies.

It also includes an autoloader to load classes in both the installed packages as well as your own classes.

<!--more-->

## Installation

The easiest way to install composer on a Mac or Linux based OS is to run one of the following commands from a terminal.

```bash
curl -sS https://getcomposer.org/installer | php
```

```bash
php -r "readfile('https://getcomposer.org/installer');" | php
```

This will download a `composer.phar` file into the current directory.

If you want to be able to run composer from any directory you need to move the `composer.phar` file into a directory on your path.

```bash
sudo mv composer.phar /usr/bin/composer
```

To install on windows just download the [Composer-Setup.exe](https://getcomposer.org/Composer-Setup.exe) installer.
This will install composer as well as add it to your path and optionally add a shell extension that will let you run composer commands from Windows Explorer.

You can find further options for downloading and installing on [the official download page](https://getcomposer.org/download/).

For the rest of this article I will assume composer is installed in the local directory as `composer.phar`.

## Adding packages

Now that we have a package manager we need to install some packages.

Composer can install packages from any git, mercurial, or subversion repository as well as [PEAR](http://pear.php.net/) packages but the main source for composer packages is [Packagist](https://packagist.org/).

To install a package we need to start by creating a `composer.json` file at the root of our project.

To have composer create this file for you run the following command.

```bash
php composer.phar init
```
You will be asked questions about your application such as the package name, description, and authors.

You will then be asked if you would like to define dependencies.
You can then add dependencies and their versions.
Composer will then create a `composer.json` file with the dependencies you defined.

To then install the added packages run the following command.

```bash
php composer.phar install
```

This will download all of your requested packages and their dependencies and add then to the autoloader.

To add more packages to your application open the `composer.json` file.
There should be a `require` property with a list of your current packages.

You can add any new packages by adding them to this list.

```json
{
    "require": {
        "monolog/monolog": "~1.10.0",
        "swiftmailer/swiftmailer": "~5.2.1"
    }
}
```

To install the newly added packages or remove the deleted ones run the following command.

```bash
php composer.phar update
```

To add and install a new package in one step you can use the `require` command passing the name of the package and the version separated by a colon.

```bash
php composer.phar require symfony/filesystem:2.5.3
```
This will add the package to the `composer.json` file and install the package.


## Updating packages

To update packages just change the version numbers and run the update command again.

```bash
php composer.phar update
```

## The Autoloader

The autoloader included in composer is very flexible and can be used to load most anything.

To include the autoloader in your project require the `autoload.php` file located in the vendor directory.

```php
require('path/to/vendor/autoload.php');
```

### Adding your own classes to the autoloader.

Composer includes install packages in the autoloader automatically but you can add your own classes to the autoloader as well.

The autoloader can be configured using the `autoload` property in the `composer.json` file.

The autoloader supports 4 different methods for autoloading classes, psr-0, psr-4, classmap, and files.

#### PSR-0 / PSR-4

Composer can autoload any classes following either the [PSR-0](http://www.php-fig.org/psr/psr-0/) or the [PSR-4](http://www.php-fig.org/psr/psr-4/) naming standards.

The main differences between the two is that PSR-4 can define a namespace to start at any given directory without including all namespaces in the directory tree but PSR-4 can only load classes that are namespaced.

PSR-0 can load classes in the root namespace and can load classes using the PEAR style underscore separated classes such as the class `Net_URL_Mapper` would be located in the file `Net/URL/Mapper.php`.

```json
{
    "autoload": {
        "psr-0": {
            "Zend_": "zendframework/library/"
        },
        "psr-4": {
            "Bob\\Model": "app/models/"
        }
    }
}
```

#### Classmap and Files

By adding a directory to a `classmap` array composer will scan the directory and create a classmap for all classes in the directory.

You can also add a file directly and all classes in that file will be added to the classmap.

This can be used to load classes that do not follow the PSR-0 or PSR-4 naming standard.

```json
{
    "autoload": {
        "classmap": [
            "src/library/",
            "src/app/models/",
            "classes/MyClass.php"
        ]
    }
}
```

Files added to the `files` array will be loaded on every request.

This can be helpful for things like functions that cannot be autoloaded.

```json
{
    "autoload": {
        "files": [
            "src/library/functions.php"
        ]
    }
}
```
