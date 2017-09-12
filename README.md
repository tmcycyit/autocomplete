YitAutocomplete (fork from angucomplete)
============
Last version 1.5.1

A simple but powerful AngularJS directive that allows you to quickly create autocomplete boxes that pull data either from a server or local variable.

To see a demo go here: http://darylrowland.github.io/angucomplete

###Key Features
* Show just a title, a title and a description or a title, description and image in your autocomplete list
* Deliberately minimally styled so you can customise it to your heart's content!
* Reads JSON data and allows you to specify which fields to use for display
* Simple setup - e.g. to pull data from a server, just set the url parameter


### Getting Started
Download the code, and include the angucomplete.js file in your page. Then add the angucomplete module to your Angular App file, e.g.
```html
var app = angular.module('app', ["YitAutocomplete"]);
```

### Local Usage

```html
<yit-autocomplete id="ex1"
              placeholder="Search countries"
              pause="100"
              selectedobject="selectedCountry"
              localdata="countries"
              searchfields="name"
              titlefield="name"
              minlength="1"
              inputclass="form-control form-control-small">
</yit-autocomplete>
```

### Remote Usage

```html
<yit-autocomplete id="members"
              placeholder="Search members"
              pause="400"
              selectedobject="testObj"
              url="http://myserver.com/api/user/find?s="
              datafield="results"
              titlefield="firstName,surname"
              descriptionfield="email"
              imagefield="profilePic"
              inputclass="form-control form-control-small">
</yit-autocomplete>
```

### Description of attributes
| Attribute        | Description           | Required | Example  |
| :------------- |:-------------| :-----:| :-----|
| id | A unique ID for the field | Yes | members |
| placeholder | Placeholder text for the search field | No | Search members |
| pause | The time to wait (in milliseconds) before searching when the user enters new characters | No | 400 |
| selectedObject | Where to store the selected object in your model/controller (like ng-model) | Yes | myObject |
| url | The remote URL to hit to query for results in JSON. angucomplete will automatically append the search string on the end of this, so it must be a GET request | No | http://myserver.com/api/users/find?searchstr= |
| datafield | The name of the field in the JSON object returned back that holds the Array of objects to be used for the autocomplete list. | No | results |
| titlefield | The name of the field in the JSON objects returned back that should be used for displaying the title in the autocomplete list. Note, if you want to combine fields together, you can comma separate them here (e.g. for a first and last name combined) | Yes | firstName,lastName |
| descriptionfield | The name of the field in the JSON objects returned back that should be used for displaying the description in the autocomplete list | No | twitterUsername |
| imageuri | A http location or directory where images reside | No | http://localhost/images/ |
| imagefield | The name of the field in the JSON objects returned back that should be used for displaying an image in the autocomplete list | No | pic |
| minlength | The minimum length of string required before searching | No | 3 |
| inputclass | The classes to use for styling the input box | No | form-control |
| localdata | The local data variable to use from your controller. Should be an array of objects | No | countriesList |
| searchfields | The fields from your local data to search on (comma separate them) | No | title,description |
| addnew | the boolean value which turns on/off the addNew action.Default it`s false | No | true
| addbutton | the text on button which does addNew action | yes | "addNew"
| addbuttonclass | the css class on addNew button | No | 
| addnewurl | the url for putting new item.New item will concat with url.The url method must be PUT | No | "example/putNewAddress/"
| initUrl | the Url for initialization value of input.The Url method must be GET | No | "../myhost/getname/0"
| resetFunction | the function which resets the directive.Note It calls the link function again.We pass an object(bi-dir) and IT MUST NOT BE INITIALIZED,It makes a function on passed object.If We want to use reset function,we must pass reset attribute true | No | 'reset'
| reset | Boolean expression true/false as turning on/off resetFunction. | No | "false" 
| disable | Boolean expression true/false as disable/enable input. | No | "id === 24"
| noResultText | String which will show,when there is not result.Default "No Result Found" | No | "empty"
| showAddNew | Bi-dir object which tells,that autocomplete has found anything or not.| No | "addNewListener"
### Running test suite

In order to run tests clone repository and run following commands within
repo's directory:

```shell
bower install
grunt
```

### License
The angucomplete project is covered by the [MIT License](http://opensource.org/licenses/MIT "MIT License").

The MIT License (MIT)

Copyright (c) 2014 Daryl Rowland, and contributors to the angucomplete project.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

