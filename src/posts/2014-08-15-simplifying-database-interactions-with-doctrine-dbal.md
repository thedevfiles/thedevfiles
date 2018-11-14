---
slug: simplifying-database-interactions-with-doctrine-dbal
path: "/2014/08/simplifying-database-interactions-with-doctrine-dbal"
title: Simplifying database interactions with Doctrine DBAL
date: 2014-08-15 00:00:00
description: This article will introduce Doctrine DBAL for a more user friendly developer experience than straight PDO.
published: true
comments: true
sharing: true
image: "../assets/images/featured/Doctrine_logo_white.png"
image_width: 191
image_height: 53
categories: [User Guide]
tags:
    - php
    - database
    - doctrine
---

I previously wrote about [switching from the mysql extension to PDO](/2014/08/moving-from-mysql-query-to-pdo/).
PDO introduces a number of convenient features beyond the mysql extension such as transactions, prepared statements, and more fetching options.
However there are still a few things that are a bit painful.

This article will introduce [Doctrine DBAL](http://www.doctrine-project.org/projects/dbal.html) to help alleviate some of these pain points.

<abbr title="Doctrine database abstraction &amp; access layer">Doctrine DBAL</abbr> is a wrapper around [PDO](http://php.net/manual/en/book.pdo.php).
It adds a few conveniences beyond straight PDO as well as a query builder.

<!--more-->

There are a [number of projects](http://www.doctrine-project.org/projects.html) under the Doctrine umbrella including a full <abbr title="Object Relational Mapper">ORM</abbr>.
This article will only cover the DBAL project.

## Installing Doctrine DBAL

The recommended way to install Doctrine DBAL is via [composer](https://getcomposer.org/).

Add to the composer.json require section

```json
"doctrine/dbal": "2.3.4"
```

Alternatively you can download a zip archive from the [project page](http://www.doctrine-project.org/projects/dbal.html).

If you aren't using composer or don't have a PSR-0 compatible autoloader you will need to add the class loader in the Doctrine/Common folder to load the Doctrine DBAL classes.

[Setup Class Loader](http://docs.doctrine-project.org/projects/doctrine-dbal/en/latest/reference/introduction.html)

```php
use Doctrine\Common\ClassLoader;

require '/path/to/doctrine/lib/Doctrine/Common/ClassLoader.php';

$classLoader = new ClassLoader('Doctrine', '/path/to/doctrine');
$classLoader->register();
```

## Connecting to The Database

Doctrine DBAL can connect to any type of database that PDO can connect to.
For this article I am going to assume you are connecting to MySQL but the api is the same regardless of the database you are connecting to.

[Connection Documentation](http://docs.doctrine-project.org/projects/doctrine-dbal/en/latest/reference/configuration.html#)
```php
$config = new \Doctrine\DBAL\Configuration();

$connectionParams = array(
    'dbname' => 'database',
    'user' => 'user',
    'password' => 'password',
    'host' => 'localhost',
    'port' => 3306,
    'charset' => 'utf8',
    'driver' => 'pdo_mysql',
);
$dbh = \Doctrine\DBAL\DriverManager::getConnection($connectionParams, $config);
```

One advantage that Doctrine DBAL has over plain PDO is that the Doctrine connection doesn't actually connect to the database until the first query is run.
This means you can create the connection in the bootstrap of your application and if no queries are run for a particular request it wont need to actually connect to the database server.
PDO connects to the database server as soon as you create a PDO instance.

## Running Queries

Being a wrapper around PDO you can use the full PDO api including prepared statements and transactions just like you would with straight PDO.

Fetching Data works exactly the same as with straight PDO.

[Fetching Documentation](http://docs.doctrine-project.org/projects/doctrine-dbal/en/latest/reference/data-retrieval-and-manipulation.html#fetchall)

```php
// Fetch one row
$sth = $dbh->query("SELECT * FROM users WHERE id = 1");
$user = $sth->fetch();

// Fetch all rows
$sth = $dbh->query("SELECT * FROM users");
$users = $sth->fetchAll();

// Fetch column as scalar value
$sth = $dbh->query("SELECT email FROM users WHERE id = 1");
$email = $sth->fetchColumn();

// Fetch column as array of scalar values
$sth = $dbh->query("SELECT email FROM users");
$emails = $sth->fetchAll(PDO::FETCH_COLUMN);

// Fetch column as key value pairs
$sth = $dbh->query("SELECT id, email FROM users");
$users = $sth->fetchAll(PDO::FETCH_KEY_PAIR);
```

Prepared statements are also the same as straight PDO.

[Prepared Statements Documentation](http://docs.doctrine-project.org/projects/doctrine-dbal/en/latest/reference/data-retrieval-and-manipulation.html#using-prepared-statements)
```php
$sth = $dbh->prepare("SELECT * FROM users WHERE id = ?");
$sth->bindValue(1, $id, PDO::PARAM_INT);
$sth->execute();
$user = $sth->fetchAssoc();

$sth = $dbh->prepare("UPDATE users SET name = :name, email = :email WHERE id = :id");
$sth->bindValue(":name", $name);
$sth->bindValue(":email", $email);
$sth->bindValue(":id", $id, PDO::PARAM_INT);
$sth->execute();
```

With Doctrine DBAL you can combine preparing and executing into one step.

Preparing and Executing in one command

```php
$sth = $conn->executeQuery('SELECT * FROM users WHERE email = ?', array('email@excample.com'));
$user = $sth->fetch();

// executeUpdate will return the number of affected rows
$count = $dbh->executeUpdate("UPDATE users SET name = ?, email = ? WHERE id = ?", array($name, $email, $id));
// Same with named parameters
$count = $dbh->executeUpdate("UPDATE users SET name = :name, email = :email WHERE id = :id", array('name' => $name, 'email' => $email, 'id' => $id));

// You can even prepare, execute, and fetch in one step
$users = $dbh->fetchAll("SELECT * FROM users WHERE name LIKE ?", array($name . '%'));
```

## Inserts, Updates, and Deletes

With Doctrine DBAL you don't even need to write sql for inserts, updates, and deletes.

[Inserts Documentation](http://docs.doctrine-project.org/projects/doctrine-dbal/en/latest/reference/data-retrieval-and-manipulation.html#insert)
```php
// Insert a new user into the users table
$dbh->insert('users', array('name' => 'Bob', 'email' => 'bob@example.com'));
// This is the same as running the following query
// INSERT INTO users (name, email) VALUES ('Bob', 'bob@example.com')
```

[Updates Documentation](http://docs.doctrine-project.org/projects/doctrine-dbal/en/latest/reference/data-retrieval-and-manipulation.html#update)
```php
$dbh->update('users', array('name' => 'Bob'), array('id' => 1));
// This is the same as running the following query
// UPDATE users SET name = 'Bob' WHERE id = 1
```

[Deletes Documentation](http://docs.doctrine-project.org/projects/doctrine-dbal/en/latest/reference/data-retrieval-and-manipulation.html#delete)
```php
$dbh->delete('users', array('id' => 1));
// This is the same as running the following query
// DELETE FROM users WHERE id = 1
```

## Query Builder

Doctrine DBAL also features a [query builder](http://docs.doctrine-project.org/projects/doctrine-dbal/en/latest/reference/query-builder.html) to help build complicated SQL queries.

```php
// This will run the following query
/*
SELECT u.id, u.name, u.email, p.bio
FROM users u
INNER JOIN user_profile p ON (u.id = p.user_id)
WHERE u.id = 1
ORDER BY u.name ASC
*/
$id = 1;
$query = $dbh->createQueryBuilder();
$query->select('u.id', 'u.name', 'u.email', 'p.bio')
      ->from('users', 'u')
      ->innerJoin('u', 'user_profile', 'p', 'u.id = p.user_id')
      ->orderBy('u.name', 'ASC')
      ->where('u.id = :id')
      ->setParameter(':id', $id)
;
$sth = $query->execute();
$user = $sth->fetchAssoc();
```

Where I find the query builder to be the most helpful is when you have parts of the query that are dependent on user provided data.

For example imagine a page with a search form with multiple fields that filter results by different columns.
You might have a text field to search the names of users and another text field to search by email address.
There is also a select box to search by account type with the values Any, Editors, and Members.
If Any is selected you do not want to filter by account type but if Editors or Members is selected you do.
With the other fields you only want to filter them if the user entered anything in the fields.
You always only want to return active accounts.

```php
// User provided search data
$search = array(
  'name' => 'Bob',
  'email' => null,
  'type' => 'any'
);

// Query That should be run
// SELECT * FROM users WHERE name LIKE '%Bob%'
```

```php
// User provided search data
$search = array(
  'name' => 'Bob',
  'email' => 'email@example.com',
  'type' => 'member'
);

// Query That should be run
// SELECT * FROM users WHERE active = 1 AND name LIKE '%Bob%' AND email LIKE '%email@example.com%' AND type = 'member' ORDER BY name ASC
```

With straight SQL the only way to build this query is with string concatenation.

Building query with string concatenation and PDO
```php
$where = array("active = 1");
if ($search['name']) {
    $where[] = "name LIKE :name";
}
if ($search['email']) {
    $where[] = "email LIKE :email";
}
if ($search['type'] != 'any') {
    $where[] = "type = :type";
}
if ($where) {
    $where = implode(" AND ", $where);
} else {
    $where = '';
}

$sql = "SELECT * FROM users WHERE " . $where . " ORDER BY name ASC";
$sth = $dbh->prepare($sql);
if ($search['name']) {
    $sth->bindValue(':name', "%" . $search['name'] . "%");
}
if ($search['email']) {
    $sth->bindValue(':email', "%" . $search['email'] . "%");
}
if ($search['type'] != 'any') {
    $sth->bindValue(':type', $search['type']);
}
$sth->execute();
$users = $sth->fetchAll(PDO::FETCH_ASSOC);
```

This example is actually pretty simple and the code is already difficult to understand.

Lets look at the same example using the query builder

Using the query builder
```php
$query = $dbh->createQueryBuilder();
$query->select('*');
$query->from('users');
$query->where("active = 1");
if ($search['name']) {
    $query->andWhere('name LIKE :name');
    $query->setParameter(':name', "%" . $search['name'] . "%");
}
if ($search['email']) {
    $query->andWhere('email LIKE :email');
    $query->setParameter(':email', "%" . $search['email'] . "%");
}
if ($search['type'] != 'any') {
    $query->andWhere('type = :type');
    $query->setParameter(':type', $search['type']);
}
$query->orderBy('name', 'ASC');
$sth = $query->execute();
$users = $sth->fetchAll(PDO::FETCH_ASSOC);
```

Not only is that code shorter but if you read it out loud it even sounds more like English.
This greatly helps at understanding what the code does at a glance 6 months later.

The query builder does result in some extra overhead as it needs to compile the query so raw SQL is generally a better idea if the query is simple.

## Conclusion

Doctrine DBAL adds a lot of functionality for a very lightweight overhead.
Even if you don't use the query builder it is worth it for the shorter syntax on inserts, updates, and deletes as well as the ability to prepare, execute, and fetch data in one statement.

There is a lot more functionality I didn't cover so I recommend taking a look at [the documentation](http://docs.doctrine-project.org/projects/doctrine-dbal/en/latest/index.html)
for other pieces of functionality such as events, a schema manager, caching, sharding, and more.
