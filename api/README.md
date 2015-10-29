# Appsumo Challenge Survey App

## API Documentation


* [middleware/passport-facebook](#module_middleware/passport-facebook)
    * [~auth(req, res, next)](#module_middleware/passport-facebook..auth)
    * [~callback(req, res, next)](#module_middleware/passport-facebook..callback)


* [middleware/passport-google](#module_middleware/passport-google)
    * [~auth(req, res, next)](#module_middleware/passport-google..auth)
    * [~callback(req, res, next)](#module_middleware/passport-google..callback)


* [models/SurveyQuestion](#module_models/SurveyQuestion)
    * [~SurveyQuestion](#module_models/SurveyQuestion..SurveyQuestion)
    * [~TYPES](#module_models/SurveyQuestion..TYPES) : <code>enum</code>


* [routes/index](#module_routes/index)
    * [~/()](#module_routes/index../) ⇒
    * [~/results()](#module_routes/index../results) ⇒
    * [~/answer(uuid)](#module_routes/index../answer) ⇒
    * [~/login()](#module_routes/index../login) ⇒
    * [~/logout()](#module_routes/index../logout) ⇒
    * [~/register()](#module_routes/index../register) ⇒
    * [~/manage()](#module_routes/index../manage) ⇒
    * [~/add-question()](#module_routes/index../add-question) ⇒


* [routes/surveyQuestion](#module_routes/surveyQuestion)
    * [~/secure/()](#module_routes/surveyQuestion../secure/) ⇒
    * [~/secure/archive(UUID)](#module_routes/surveyQuestion../secure/archive) ⇒
    * [~/secure/unarchive(UUID)](#module_routes/surveyQuestion../secure/unarchive) ⇒
    * [~/secure/(UUID)](#module_routes/surveyQuestion../secure/) ⇒


-----

### Modules
<dl>
<dt><a href="#module_auth">auth</a></dt>
<dd><p>Utility for ensuring the user is authenticated and authorized.</p>
</dd>
<dt><a href="#module_index">index</a></dt>
<dd><p>Main application.</p>
<p>Express based utilizing SequelizeJS and handlebars templates directly rendered.</p>
</dd>
<dt><a href="#module_middleware/passport-facebook">middleware/passport-facebook</a></dt>
<dd><p>This is an express middleware for connecting to facebook utilizing <a href="http://passportjs.org/">Passport</a>.</p>
<p><strong>Not Yet Implemented</strong></p>
<p><em>Note: This requires a valid client setup from the facebook developer console for OAuth2 Credentials</em></p>
</dd>
<dt><a href="#module_middleware/passport-google">middleware/passport-google</a></dt>
<dd><p>This is an express middleware for connecting to google plus utilizing <a href="http://passportjs.org/">Passport</a>.</p>
<p><em>Note: This requires a valid client setup from the google developer console for OAuth2 Credentials and the Google+ API enabled</em></p>
</dd>
<dt><a href="#module_middleware/return">middleware/return</a></dt>
<dd><p>This is an express middleware intended to be used as the end for an api call.</p>
</dd>
<dt><a href="#module_models/Answer">models/Answer</a></dt>
<dd><p>A model definition for Answers. Storage for answers.</p>
</dd>
<dt><a href="#module_models/Provider">models/Provider</a></dt>
<dd><p>A model definition for OAuth2 Providers.</p>
</dd>
<dt><a href="#module_models/SurveyQuestion">models/SurveyQuestion</a></dt>
<dd><p>A model definition for survey questions.</p>
</dd>
<dt><a href="#module_models/User">models/User</a></dt>
<dd><p>A model definition for Users.</p>
</dd>
<dt><a href="#module_routes/answer">routes/answer</a></dt>
<dd><p>API routes for manipulating <a href="#module_models/Answer">models/Answer</a></p>
</dd>
<dt><a href="#module_routes/index">routes/index</a></dt>
<dd><p>The default page router, used for render routes</p>
</dd>
<dt><a href="#module_routes/surveyQuestion">routes/surveyQuestion</a></dt>
<dd><p>API routes for manipulating <a href="#module_models/SurveyQuestion">models/SurveyQuestion</a></p>
</dd>
</dl>
<a name="module_auth"></a>
### auth
Utility for ensuring the user is authenticated and authorized.


-

<a name="module_auth..ROLES"></a>
#### *auth*~ROLES : <code>enum</code>
User authorization roles.

Roles are order dependent, lowest (e.g. zeoreth element) is least priveleged with more priveleges granted
the higher you go in the roles.

**Read only**: true  
**Properties**

| Name | Description |
| --- | --- |
| subscriber | The base role for a new user |
| admin | Admin level users get this role |
| superuser | Highest level user, should be able to do anything they want |


-

<a name="module_index"></a>
### index
Main application.

Express based utilizing SequelizeJS and handlebars templates directly rendered.


-

<a name="module_middleware/passport-facebook"></a>
### middleware/passport-facebook
This is an express middleware for connecting to facebook utilizing [Passport](http://passportjs.org/).

**Not Yet Implemented**

_Note: This requires a valid client setup from the facebook developer console for OAuth2 Credentials_


-

<a name="module_middleware/passport-facebook..auth"></a>
#### *middleware/passport-facebook*~auth(req, res, next)
The auth exppress call for this middleware.


| Param | Description |
| --- | --- |
| req | The request |
| res | The response |
| next | A next callback to pass this on to |


-

<a name="module_middleware/passport-facebook..callback"></a>
#### *middleware/passport-facebook*~callback(req, res, next)
The exppress callback for this middleware used as the OAuth2 Return.


| Param | Description |
| --- | --- |
| req | The request |
| res | The response |
| next | A next callback to pass this on to |


-

<a name="module_middleware/passport-google"></a>
### middleware/passport-google
This is an express middleware for connecting to google plus utilizing [Passport](http://passportjs.org/).

_Note: This requires a valid client setup from the google developer console for OAuth2 Credentials and the Google+ API enabled_


-

<a name="module_middleware/passport-google..auth"></a>
#### *middleware/passport-google*~auth(req, res, next)
The auth exppress call for this middleware.


| Param | Description |
| --- | --- |
| req | The request |
| res | The response |
| next | A next callback to pass this on to |


-

<a name="module_middleware/passport-google..callback"></a>
#### *middleware/passport-google*~callback(req, res, next)
The exppress callback for this middleware used as the OAuth2 Return.


| Param | Description |
| --- | --- |
| req | The request |
| res | The response |
| next | A next callback to pass this on to |


-

<a name="module_middleware/return"></a>
### middleware/return
This is an express middleware intended to be used as the end for an api call.


-

<a name="exp_module_middleware/return--module.exports"></a>
#### module.exports(req, res) ⏏
This is used to determine if the page needs to be re-routed or if the user
was an api user and is expecting a raw json output.


| Param | Description |
| --- | --- |
| req | The request |
| res | The response |


-

<a name="module_models/Answer"></a>
### models/Answer
A model definition for Answers. Storage for answers.


-

<a name="module_models/Answer..Answer"></a>
#### *models/Answer*~Answer
**License**: MIT  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| uuid | <code>Sequelize.UUID</code> | The primary key for this model |
| answer | <code>Sequelize.STRING</code> | The answer to the associated question. |
| author | <code>Sequelize.belongsTo</code> | The author of this question. |

**See**: [models/SurveyQuestion](#module_models/SurveyQuestion)

-

<a name="module_models/Provider"></a>
### models/Provider
A model definition for OAuth2 Providers.


-

<a name="module_models/Provider..Provider"></a>
#### *models/Provider*~Provider
**License**: MIT  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| uuid | <code>Sequelize.UUID</code> | The primary key for this model |
| type | <code>Sequelize.STRING</code> | The provider type (e.g. google, facebook, etc.) |
| providerId | <code>Sequelize.STRING</code> | The id from the provider (could be a string or url) |
| link | <code>Sequelize.STRING</code> | Link to the provider profile for this user. |
| accessToken | <code>Sequelize.STRING</code> | The access token for OAuth2 |
| refreshToken | <code>Sequelize.STRING</code> | The refresh token for OAuth2 |


-

<a name="module_models/SurveyQuestion"></a>
### models/SurveyQuestion
A model definition for survey questions.


-

<a name="module_models/SurveyQuestion..SurveyQuestion"></a>
#### *models/SurveyQuestion*~SurveyQuestion
**License**: MIT  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| uuid | <code>Sequelize.UUID</code> | The primary key for this model |
| question | <code>Sequelize.STRING</code> | The question to ask survey respondants. |
| type | <code>Sequelize.ENUM</code> | The field type of question {TYPES} |
| options | <code>Sequelize.STRING</code> | The options for type that takes options as a comma seperated string |
| archived | <code>Sequelize.BOOLEAN</code> | A flag as to whether or not this survey question is archived.     When a question is archived it should not be displayed to survey respondants. |
| author | <code>Sequelize.belongsTo</code> | The author of this question. |
| answers | <code>Sequelize.hasMany</code> | The answers to this question. |


-

<a name="module_models/SurveyQuestion..TYPES"></a>
#### *models/SurveyQuestion*~TYPES : <code>enum</code>
The field types for questions.

**Read only**: true  
**Properties**

| Name | Description |
| --- | --- |
| text | A text type field |
| checkbox | A checkbox type field, if there are multiple options then this a multi-check |
| radios | A radio buttons type field |
| textarea | A textarea type field |
| select | A single select type field |


-

<a name="module_models/User"></a>
### models/User
A model definition for Users.


-

<a name="module_models/User..User"></a>
#### *models/User*~User
**License**: MIT  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| uuid | <code>Sequelize.UUID</code> | The primary key for this model |
| firstName | <code>Sequelize.STRING</code> | The first name of this user. |
| lastName | <code>Sequelize.STRING</code> | The last name of this user. |
| userName | <code>Sequelize.STRING</code> | The username for this user (defaults to the email address). |
| email | <code>Sequelize.STRING</code> | The email address of this user. |
| password | <code>Sequelize.STRING</code> | The password for this user (hashed on may not exist if a provider does). |
| role | <code>Sequelize.STRING</code> | The role of this user (default='subscriber'). |
| providers | <code>Sequelize.hasMany</code> | A set of providers for this user. |

**See**: [models/Provider](#module_models/Provider)

-

<a name="module_routes/answer"></a>
### routes/answer
API routes for manipulating [models/Answer](#module_models/Answer)


-

<a name="module_routes/answer../"></a>
#### *routes/answer*~/() ⇒
**route**: /

**method**: POST

**Returns**: The posted answer or a redirect to returnTo  
**Example**  
```js
{
   ...
   uuid: 'f1f1d524-eee3-4d24-98e5-781a6bf7a739'
   answer: 'foo,bar',
   ...
 }
```

-

<a name="module_routes/index"></a>
### routes/index
The default page router, used for render routes


-

<a name="module_routes/index../"></a>
#### *routes/index*~/() ⇒
**route**: /

**method**: GET

**Returns**: renders index  

-

<a name="module_routes/index../results"></a>
#### *routes/index*~/results() ⇒
**route**: /results

**method**: GET

**Returns**: renders results  

-

<a name="module_routes/index../answer"></a>
#### *routes/index*~/answer(uuid) ⇒
**route**: /answer/:uuid

**method**: GET

_Requires authentication and admin priveleges_


| Param | Type |
| --- | --- |
| uuid | <code>UUID</code> | 

**Returns**: renders answers for given uuid  

-

<a name="module_routes/index../login"></a>
#### *routes/index*~/login() ⇒
**route**: /login

**method**: GET

**Returns**: renders login  

-

<a name="module_routes/index../logout"></a>
#### *routes/index*~/logout() ⇒
**route**: /logout

**method**: GET

**Returns**: redirects to returnTo or '/' if no returnTo  

-

<a name="module_routes/index../register"></a>
#### *routes/index*~/register() ⇒
**route**: /register

**method**: GET

**Returns**: renders resgister  

-

<a name="module_routes/index../manage"></a>
#### *routes/index*~/manage() ⇒
**route**: /manage

**method**: GET

_Requires authentication and admin priveleges_

**Returns**: renders manage  

-

<a name="module_routes/index../add-question"></a>
#### *routes/index*~/add-question() ⇒
**route**: /add-question

**method**: GET

_Requires authentication and admin priveleges_

**Returns**: renders add-question  

-

<a name="module_routes/surveyQuestion"></a>
### routes/surveyQuestion
API routes for manipulating [models/SurveyQuestion](#module_models/SurveyQuestion)


-

<a name="module_routes/surveyQuestion../secure/"></a>
#### *routes/surveyQuestion*~/secure/() ⇒
**route**: /secure/

**method**: POST

**Returns**: The posted question or a redirect to returnTo  
**Example**  
```js
{
   ...
   uuid: 'f1f1d524-eee3-4d24-98e5-781a6bf7a739'
   question: 'What do monkeys like more?',
   type: 'select',
   options: 'apples, oranges, bananas'
   ...
 }
```

-

<a name="module_routes/surveyQuestion../secure/archive"></a>
#### *routes/surveyQuestion*~/secure/archive(UUID) ⇒
**route**: /secure/archive/:uuid

**method**: GET


| Param | Description |
| --- | --- |
| UUID | uuid - The uuid of the question to archive |

**Returns**: The posted question or a redirect to returnTo  
**Example**  
```js
{
   ...
   uuid: 'f1f1d524-eee3-4d24-98e5-781a6bf7a739'
   question: 'What do monkeys like more?',
   type: 'select',
   options: 'apples, oranges, bananas',
   archived: true
   ...
 }
```

-

<a name="module_routes/surveyQuestion../secure/unarchive"></a>
#### *routes/surveyQuestion*~/secure/unarchive(UUID) ⇒
**route**: /secure/unarchive/:uuid

**method**: GET


| Param | Description |
| --- | --- |
| UUID | uuid - The uuid of the question to unarchive |

**Returns**: The posted question or a redirect to returnTo  
**Example**  
```js
{
   ...
   uuid: 'f1f1d524-eee3-4d24-98e5-781a6bf7a739'
   question: 'What do monkeys like more?',
   type: 'select',
   options: 'apples, oranges, bananas',
   archived: false
   ...
 }
```

-

<a name="module_routes/surveyQuestion../secure/"></a>
#### *routes/surveyQuestion*~/secure/(UUID) ⇒
**route**: /secure/:uuid

**method**: DELETE


| Param | Description |
| --- | --- |
| UUID | uuid - The uuid of the question to delete |

**Returns**: an empty success or a redirect to returnTo  

-

