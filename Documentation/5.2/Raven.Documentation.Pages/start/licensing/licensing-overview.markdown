﻿# Licensing Overview
---

{NOTE: }

* The license key is in JSON format.  
  It is sent to the email address that was provided when obtaining the license.  

* There are a few __license types__ available, see below.  

* Each license has a specific date on which it will expire.  
  To renew your license see [renew license](../../start/licensing/renew-license).   

* In this page:
    * [License types](../../start/licensing/licensing-overview#license-types)
    * [Manage license view](../../start/licensing/licensing-overview#manage-license-view)

{NOTE/}

---

{PANEL: License types}

{INFO: }
Visit the [pricing page](https://ravendb.net/buy) to see which features are included with each license type.
{INFO/}

{NOTE: }
__Developer__  

  * The developer license is for development use only and isn't applicable for commercial use.  
    You must upgrade this license before going into production.   
  * It is fully featured but temporary - license lasts 6 months and can be renewed.  
  * Certificates exceeding 4 months expiration period are Not allowed to be used with this license.  
    Automatic renewal of Let’s Encrypt certificates is disabled.  
  * When you are ready to go into production:  
    * Be sure to choose a license that has all features with which your client was developed.  
    * [Upgrade to a production license](https://ravendb.net/buy) and then [replace](../../start/licensing/replace-license) the developer license.  
    
  * The developer license can be obtained [here](https://ravendb.net/buy#developer).
{NOTE/}

{NOTE: }
__Community__  

  * A basic production-grade license.
  * Community licenses last for one year and can be renewed every year.  
{NOTE/}

{NOTE: }
__Professional__  

  * A standard production-grade license.  
  * Extended automatically if the server has access to RavenDB's License Server.  
{NOTE/}

{NOTE: }
__Enterprise__  

  * A high-performance, fully-featured production-grade license.  
  * Extended automatically if the server has access to RavenDB's License Server.  
{NOTE/}

{NOTE: }
__ISV Licenses__

* ISV licenses are commercial licenses that allow you to redistribute RavenDB with your software  
  for on-premise installation and use by your customers.  
* Available ISV license types are: Essential, Professional, and Enterprise.  
* [Contact RavenDB for more details](https://ravendb.net/contact).

{NOTE/}


{PANEL/}

{PANEL: Manage license view}

![About page](images/about-page.png "About page")

#### 1. &nbsp; About
* Go to the About page to see the version, license, and support info.

#### 2. &nbsp; Version
* __Current version__:  
  Specifies the current Server and Studio client versions used.  
  Knowing the version is important as documentation, features, and patches are version sensitive.
* __Send Feedback__:  
  You can send RavenDB feedback about any issues you've encountered.
* __Latest version info__:  
  Specifies whether you are using the latest Server version.  
  If you need to upgrade to a new version see [upgrading instructions](../../start/installation/upgrading-to-new-version).  

#### 3. &nbsp; License Information  
* __Type__:  
  Specifies which license type you're using.  
* __Expires__:  
  Specifies the date on which the license will expire.  
* __Available features__:  
  The features included with this license are listed.  
* <a id="license-server" /> __License Server__:  
  Notifies if there is an active connection to RavenDB's License Server.  
  If you aren't connected, it is usually either because a firewall is blocking the connection,  
  or your server is running offline.  
    * Make sure that RavenDB has access to `api.ravendb.net`.  
    * Click the refresh button to check the connection.  

  ![License server connection](images/license-server.png "License server connection")

#### 4. &nbsp; Available actions  
* [Replace License](../../start/licensing/replace-license) / [Force Update](../../start/licensing/force-update) / [Renew License](../../start/licensing/renew-license)  

#### 5. &nbsp; Support plan  
* Specifies the support options available under your current support plan.

#### 6. &nbsp; Links
* __Access__:  
  Click to select RavenDB Community Discussions in GitHub, or Google Groups archive.
* __Upgrade__:  
  Click to go to the RavenDB support options page.


{PANEL/}

## Related Articles

### Licensing
- [Activate license](../../start/licensing/activate-license)
- [Replace license](../../start/licensing/replace-license)
- [Renew license](../../start/licensing/renew-license)
- [Force update license](../../start/licensing/force-update)

### Server
- [License configuration options](../../server/configuration/license-configuration)

## Related Links

- [Get License](https://ravendb.net/buy)
- [Support Options](https://ravendb.net/support)

