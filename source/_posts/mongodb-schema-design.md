---
date: 2017-01-11 12:00:00
title: Rules of Thumb for MongoDB Schema Design
author: Keon Kim
categories:
  - db
---

This is a summary of [6 Rules of Thumb for MongoDB Schema Design](https://www.mongodb.com/blog/post/6-rules-of-thumb-for-mongodb-schema-design-part-1), which details how should MongoDB schemas should be organized in three separate blogs posts. So please take a look if this summarization is not sufficient.
<!--more-->
If you are new to MongoDB it is natural to ask how should one structure the schema for One-to-Many relationship.

## Basics

Relationships can be in three different forms.

* One-to-Few
* One-to-Many
* One-to-Squillions

Each methods for structuring has its pros and cons. So the user should know how to decide which one is better than the other in the given situation.

## One-to-Few
```javascript
// person
{
  name: "Keon Kim",
  hometown: "Seoul",
  addresses: [
    { city: 'Manhattan', state: 'NY', cc: 'USA' },
    { city: 'Jersey City', state: 'NJ', cc: 'USA' }
  ]
}
```

### Pros
- You can call all the information in one query

### Cons
- It is impossible to search the contained entity independently.

## One-to-Many

```javascript
// parts
{
  _id: ObjectID('AAAA'),
  partno: '123-aff-456',
  name: 'Awesometel 100Ghz CPU',
  qty: 102,
  cost: 1.21,
  price: 3.99
}
// products
{
  name: 'Weird Computer WC-3020',
  manufacturer: 'Haruair Eng.',
  catalog_number: 1234,
  parts: [
    ObjectID('AAAA'),
    ObjectID('DEFO'),
    ObjectID('EJFW')
  ]
}
```
Parent holds the list of ObjectID of the child documents. This requires an application level join, not the database level join.

```javascript
// find product based on category_number.
> product = db.products.findOne({catalog_number: 1234});
// find all parts in the product's parts list.
> product_parts = db.parts.find({
                      _id: { $in : product.parts } 
                  }).toArray() ;
```

### Pros

* It is easy to handle insert, delete on each documents independently.
* It has flexibility for implementing N-to-N relationship because it is an application level join.

### Cons

* Performance drops as you call documents multiple times.

## One-to-Squillions

If you need to store tons of data (ie. event logs), you need to use a different approach since a document cannot be larger than 16MB in size. You need to use 'parent-referencing'.

```javascript
// host
{
  _id : ObjectID('AAAB'),
  name : 'goofy.example.com',
  ipaddr : '127.66.66.66'
}
// logmsg
{
  time : ISODate("2015-09-02T09:10:09.032Z"),
  message : 'cpu is on fire!',
  host: ObjectID('AAAB')       // references Host document
}
```

Later you can join like below.

```javascript
// Search parent host document
> host = db.hosts.findOne({ipaddr : '127.66.66.66'});
// Search the most recent 5000 logs
// for a host based on host's ObjectID
> last_5k_msg = db.logmsg.find({host: host._id})
                         .sort({time : -1})
                         .limit(5000)
                         .toArray()
```

## Two-Way Referencing
```javascript
// person
{
  _id: ObjectID("AAF1"),
  name: "Koala",
  tasks [ // reference task document
    ObjectID("ADF9"),
    ObjectID("AE02"),
    ObjectID("AE73")
  ]
}
// tasks
{
  _id: ObjectID("ADF9"),
  description: "Practice Jiu-jitsu",
  due_date:  ISODate("2015-10-01"),
  owner: ObjectID("AAF1") // reference person document
}
```

We put references on bot sides in order to find the opposite document in one-to-many relationship.

### Pros

* It is easy to search on both Person and Task documents


### Cons

* It requires two separate queries to update an item. The update is not atomic.

## Many-to-One Denormalization

We can structure the schema like below to avoid making multiple queries.

```javascript
// products - before
{
  name: 'Weird Computer WC-3020',
  manufacturer: 'Haruair Eng.',
  catalog_number: 1234,
  parts: [
    ObjectID('AAAA'),
    ObjectID('DEFO'),
    ObjectID('EJFW')
  ]
}
// products - after
{
  name: 'Weird Computer WC-3020',
  manufacturer: 'Haruair Eng.',
  catalog_number: 1234,
  parts: [ // denormalization
    { id: ObjectID('AAAA'), name: 'Awesometel 100Ghz CPU' },
    { id: ObjectID('DEFO'), name: 'AwesomeSize 100TB SSD' },
    { id: ObjectID('EJFW'), name: 'Magical Mouse' }
  ]
}
```

You can use it like below in the application level:

```javascript
// search product document
> product = db.products.findOne({catalog_number: 1234});
// make a list of part id using map() function
// from the list of ObjectIDs
> part_ids = product.parts.map( function(doc) { return doc.id } );
// search all parts related to the product
> product_parts = db.parts.find({_id: { $in : part_ids } } )
                          .toArray();
```

### Pros

* Denormalization reduces the cost of calling the data. 

### Cons

* When you want to update the part name, you have to update all names contained inside product document
* It is not a good choice when updates are frequent

This form of denormalization is favorable when there is no frequent updates and squillion reads.

## One-to-Many Denormalization

Unlike the previous example, we can denormalize in the opposite way. The same pros and cons apply.

```javascript
// parts - before
{
  _id: ObjectID('AAAA'),
  partno: '123-aff-456',
  name: 'Awesometel 100Ghz CPU',
  qty: 102,
  cost: 1.21,
  price: 3.99
}
// parts - after
{
  _id: ObjectID('AAAA'),
  partno: '123-aff-456',
  name: 'Awesometel 100Ghz CPU',
  product_name: 'Weird Computer WC-3020', // denormalization
  product_catalog_number: 1234,           // denormalization
  qty: 102,
  cost: 1.21,
  price: 3.99
}
```

## One-to-Squillions Denormalization

```javascript
// logmsg - before
{
  time : ISODate("2015-09-02T09:10:09.032Z"),
  message : 'cpu is on fire!',
  host: ObjectID('AAAB')
}
// logmsg - after
{
  time : ISODate("2015-09-02T09:10:09.032Z"),
  message : 'cpu is on fire!',
  host: ObjectID('AAAB'),
  ipaddr : '127.66.66.66'
}
> last_5k_msg = db.logmsg.find({ipaddr : '127.66.66.66'})
                         .sort({time : -1})
                         .limit(5000)
                         .toArray()
```

In fact, you can merge the two documents.

```javascript
{
    time : ISODate("2015-09-02T09:10:09.032Z"),
    message : 'cpu is on fire!',
    ipaddr : '127.66.66.66',
    hostname : 'goofy.example.com'
}
```

It would be used like this in the code.

```javascript
// receive log from monitoring program.
logmsg = get_log_msg();
log_message_here = logmsg.msg;
log_ip = logmsg.ipaddr;
// get timestamp
now = new Date();
// find host's id for update
host_doc = db.hosts.findOne({ ipaddr: log_ip },{ _id: 1 });
host_id = host_doc._id;
// save denoramlized data
db.logmsg.save({
    time : now,
    message : log_message_here,
    ipaddr : log_ip,
    host : host_id ) });
// Push the denoramlized data in 'one'
db.hosts.update( {_id: host_id }, {
    $push : {
      logmsgs : {
        $each:  [ { time : now, message : log_message_here } ],
        $sort:  { time : 1 },  // sort by time
        $slice: -1000          // get top 1000
      }
    }
  });
```

## 6 Rules of Thumb

Here are some “rules of thumb” to guide you through these indenumberable (but not infinite) choices

### One

favor embedding unless there is a compelling reason not to

### Two
needing to access an object on its own is a compelling reason not to embed it

### Three
Arrays should not grow without bound. If there are more than a couple of hundred documents on the “many” side, don’t embed them; if there are more than a few thousand documents on the “many” side, don’t use an array of ObjectID references. High-cardinality arrays are a compelling reason not to embed.

### Four
Don’t be afraid of application-level joins: if you index correctly and use the projection specifier then application-level joins are barely more expensive than server-side joins in a relational database.

### Five
Consider the write/read ratio when denormalizing. A field that will mostly be read and only seldom updated is a good candidate for denormalization: if you denormalize a field that is updated frequently then the extra work of finding and updating all the instances is likely to overwhelm the savings that you get from denormalizing.

### Six
As always with MongoDB, how you model your data depends – entirely – on your particular application’s data access patterns. You want to structure your data to match the ways that your application queries and updates it.


## References

* [6 Rules of Thumb for MongoDB Schema Design Part 1](https://www.mongodb.com/blog/post/6-rules-of-thumb-for-mongodb-schema-design-part-1), [Part 2](https://www.mongodb.com/blog/post/6-rules-of-thumb-for-mongodb-schema-design-part-2), [Part 3](https://www.mongodb.com/blog/post/6-rules-of-thumb-for-mongodb-schema-design-part-3)
