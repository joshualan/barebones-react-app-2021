import React, { useState, useEffect } from "react";
import { DropDownList } from "@progress/kendo-react-dropdowns";

import ResourceGrid from "./ResourceGrid";

const Resources = () => {
  const [tenant, setTenant] = useState("");
  const [tenantsList, setTenantsList] = useState([]);
  const [site, setSite] = useState("");
  const [siteMap, setSiteMap] = useState({});
  const [sitesList, setSitesList] = useState([]);
  const [resources, setResources] = useState([]);

  useEffect(() => {
    requestTenants();
  }, []);

  useEffect(() => {
    setSitesList(siteMap[tenant] || []);
  }, [tenant]);

  async function requestTenants() {
    const res = await fetch(
      "https://tenantsandsites.azurewebsites.net/api/Sites?code=bmuHfXVJfQ8fDLmZFiN89e2/KdQc/rIpOT/6JctxQLLTfYcydER7SQ==",
      { method: "GET", mode: "cors" }
    );

    const json = await res.json();
    const m = {};

    json.forEach((s) => {
      m[s.TenantID] = m[s.TenantID] || [];
      m[s.TenantID].push(s.SiteID);
    });

    setTenantsList(Object.keys(m));
    setSiteMap(m);
  }

  async function requestResources() {
    if (!tenant || !site) {
      return;
    }

    const res = await fetch(
      `https://wugdeviceconfighandler.azurewebsites.net/api/Resources/${tenant}/${site}?code=ohoA9yF29wlnpmZi3rmxapSi06KMfA60/QAF/oLls6/xoaL3k1sK2A==`,
      { method: "GET", mode: "cors" }
    );

    const json = await res.json();
    setResources(json);
  }

  const handleTenantChange = (event) => {
    setTenant(event.target.value);
  };

  const handleSiteChange = (event) => {
    setSite(event.target.value);
  };

  return (
    <div className="search-params">
      <form
        className="k-form"
        onSubmit={(e) => {
          e.preventDefault();
          requestResources();
        }}
      >
        <DropDownList
          label="Tenant"
          name="tenant"
          data={tenantsList}
          required={true}
          onChange={handleTenantChange}
        />
        <DropDownList
          label="Site"
          name="site"
          data={sitesList}
          required={true}
          onChange={handleSiteChange}
        />
        <button className="k-button k-primary">Submit</button>
      </form>

      <ResourceGrid resources={resources}></ResourceGrid>
    </div>
  );
};

export default Resources;
