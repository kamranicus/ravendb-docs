# Renew License

---

{NOTE: }

* When your license __expires__ the Studio is blocked.  
  Client API operations and other RavenDB features will continue to work.  
  However, any usage of expired RavenDB licenses is outside the license agreement  
  and doesn't comply with the [EULA terms](https://ravendb.net/terms).  

* __Renew your license__ as described below.  

* In this page:
    * [Renew commercial licenses](../../start/licensing/renew-license#renew-commercial-licenses)
    * [Renew Developer & Community licenses](../../start/licensing/renew-license#renew-developer-&-community-licenses)

{NOTE/}

---

{PANEL: Renew commercial licenses}

* This section relates to all commercial licenses: __Professional__, __Enterprise__, and all __ISV licenses__.  

{NOTE: }
__Automatic renewal__:  

---
If your server has an active connection to RavenDB's [License Server](../../start/licensing/licensing-overview#license-server),  
and if the [DisableAutoUpdate](../../server/configuration/license-configuration#license.disableautoupdate) configuration is Not set to true,  
then these commercial licenses will be automatically renewed.  
{NOTE/}

{NOTE: }
__Manual (offline) renewal__:  

---
If the connection to the License Server is unavailable, contact [customer service](https://ravendb.net/contact) to extend your license.  
A license renewal email will be sent to you (the license ID will stay the __same__).  
Copy the new license key from the mail and proceed with one of the following options.  

__Either__:  

* Replace the existing license key with the new one from the Studio, as described [here](../../start/licensing/replace-license#replace-license-from-studio).

__Or__:  

* Set [DisableAutoUpdateFromApi](../../server/configuration/license-configuration#license.disableautoupdatefromapi) to true.

* Activate the new license key using the [configuration keys](../../start/licensing/activate-license#activate-license-with-configuration-keys).

* Restart your server (needed only if any configuration key was changed).  
  {NOTE/}

{PANEL/}

{PANEL: Renew Developer & Community licenses}

* The __Developer__ and __Community__ licenses are renewed from the Studio,  
  the 'Renew' button is available only for those license types.  

* They can be renewed when there are less than 30 days remaining on your current license.

![Renew License](images/renew-1.png "Renew License")

1. __About__  
   Navigate to the _About_ page in Studio  

2. __Renew__  
   Click the _RENEW LICENSE_ button  


   * ![Renew License](images/renew-2.png "Renew and Submit")  
   

3. __Renew__  
  Click to renew the current license.  
  The renewed license will be sent to you by mail.  

4. __Submit__  
   Paste the renewed license key and click Submit.

{PANEL/}

## Related Articles

### Licensing
- [Licensing overview](../../start/licensing/licensing-overview)
- [Activate license](../../start/licensing/activate-license)
- [Replace license](../../start/licensing/replace-license)
- [Force update license](../../start/licensing/force-update)

### Server
- [License configuration options](../../server/configuration/license-configuration)




