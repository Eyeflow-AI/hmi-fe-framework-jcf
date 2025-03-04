import axios from "axios";

export const instance = axios.create({
  baseURL: window.app_config.ws_url,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

function request(request, setLoading) {
  return new Promise((resolve, reject) => {
    if (Boolean(setLoading)) {
      setLoading(true);
    }
    request
      .then((result) => {
        if (result?.data) {
          resolve(result.data);
        } else {
          let errMessage;
          if (result?.data && result.data.error && result.data.error.message) {
            errMessage = result.data.error.message;
          } else {
            errMessage = "Request Failed.";
          }

          reject(new Error(errMessage));
        }
      })
      .catch((err) => {
        let errMessage =
          err?.response?.data?.errMessage ?? err?.response?.data?.err;
        let code = err?.response?.data?.code;

        if (errMessage) {
          let error = new Error(errMessage);
          error.code = code;
          reject(error);
        } else if (err?.response?.data) {
          reject(err.response.data);
        } else {
          reject(err);
        }
      })
      .finally(() => {
        if (Boolean(setLoading)) {
          setLoading(false);
        }
      });
  });
}

const API = {
  wsURL: window.app_config.ws_url,
  post: {
    login: ({ username, password }, setLoading) =>
      request(instance.post(`auth/login`, { username, password }), setLoading),
    loginByIp: (_, setLoading) =>
      request(instance.post(`auth/login/ip`), setLoading),
    batch: ({ stationId, data }, setLoading) =>
      request(instance.post(`batch/${stationId}`, data), setLoading),
    user: ({ username, password }, setLoading) =>
      request(instance.post(`auth/user`, { username, password }), setLoading),

    role: ({ roleName, description, types }, setLoading) =>
      request(
        instance.post(`auth/role`, { roleName, description, types }),
        setLoading
      ),

    addQuery: (
      { collectionName, searchMethod, queryName, query },
      setLoading
    ) =>
      request(
        instance.post(`queries/add-query`, {
          collectionName,
          searchMethod,
          queryName,
          query,
        }),
        setLoading
      ),

    runQuery: (
      { collectionName, searchMethod, query, variables = null },
      setLoading
    ) =>
      request(
        instance.post(`queries/run-query`, {
          collectionName,
          searchMethod,
          query,
          variables,
        }),
        setLoading
      ),
    toUpload: ({ jsonData, jsonFileData, folderInfo, imageURL }) =>
      request(
        instance.post(`event/to-upload`, {
          jsonData,
          jsonFileData,
          folderInfo,
          imageURL,
        })
      ),
    task: ({ stationId, task }, setLoading) =>
      request(instance.post(`tasks/${stationId}`, { task }), setLoading),
    uploadImageInfo: ({ data, imageBase64, maskMap }) =>
      request(
        instance.post(`files/tools/upload-image-info`, {
          data,
          imageBase64,
          maskMap,
        })
      ),
    script: ({ name }, setLoading) =>
      request(instance.post(`internal/script`, { name }), setLoading),

    queryPipeline: ({ name }, setLoading) =>
      request(instance.post(`internal/queries-pipeline`, { name }), setLoading),

    component: ({ name }, setLoading) =>
      request(instance.post(`internal/component`, { name }), setLoading),
    componentData: ({ data, component, stationId }, setLoading) =>
      request(
        instance.post(
          `components/${stationId}/${component}?time=${new Date().toISOString()}`,
          { data }
        ),
        setLoading
      ),
  },
  get: {
    batchList: ({ params, stationId }, setLoading) =>
      request(instance.get(`batch/${stationId}/list`, { params }), setLoading),
    partsList: (_, setLoading) =>
      request(instance.get(`parts/list`), setLoading),
    maskMapList: (_, setLoading) =>
      request(instance.get(`parts/mask-map/list`), setLoading),
    serialList: ({ params, stationId }, setLoading) =>
      request(instance.get(`serial/${stationId}/list`), setLoading),
    serial: ({ stationId, serialId, collection }, setLoading) =>
      request(
        instance.get(
          `serial/${stationId}/${serialId}?collection=${collection}`
        ),
        setLoading
      ),
    runningBatch: ({ stationId }, setLoading) =>
      request(instance.get(`batch/${stationId}/running`), setLoading),
    runningSerial: ({ stationId }, setLoading) =>
      request(instance.get(`serial/${stationId}/running`), setLoading),
    batch: ({ stationId, batchId }, setLoading) =>
      request(instance.get(`batch/${stationId}/${batchId}`), setLoading),
    batchData: ({ stationId, batchId }, setLoading) =>
      request(instance.get(`batch/${stationId}/${batchId}/data`), setLoading),
    eventList: ({ params }, setLoading) =>
      request(instance.get(`event/list`, { params }), setLoading),
    event: ({ eventId }, setLoading) =>
      request(instance.get(`event/${eventId}`), setLoading),
    stations: (_, setLoading) =>
      request(instance.get(`station/list`), setLoading),
    configForFE: (setLoading) => request(instance.get(`config/fe`), setLoading),
    configForFeStation: ({ stationId }, setLoading) =>
      request(instance.get(`config/fe/${stationId}`), setLoading),

    packageData: (setLoading) =>
      request(instance.get(`internal/package-data`), setLoading),
    languagesData: (setLoading) =>
      request(instance.get(`internal/languages-data`), setLoading),
    iconInfo: ({ icon }, setLoading) =>
      request(instance.get(`internal/icon-info/${icon}`), setLoading),

    fromToDocument: (setLoading) =>
      request(instance.get(`internal/from-to-document/`), setLoading),

    queryData: (
      { stationId, queryName, startTime, endTime, filters },
      setLoading
    ) =>
      request(
        instance.get(`queries/${stationId}/data`, {
          params: { queryName, startTime, endTime, filters },
        }),
        setLoading
      ),

    query: (_, setLoading) => request(instance.get(`queries/`, setLoading)),
    accessControlData: (setLoading) =>
      request(instance.get(`auth/access-control-data`), setLoading),
    userList: (setLoading) =>
      request(instance.get(`auth/users-list`), setLoading),
    alert: ({ stationId }, setLoading) =>
      request(instance.get(`alerts/${stationId}`), setLoading),

    appParameters: (setLoading) =>
      request(instance.get(`internal/parameters`), setLoading),
    scripts: (setLoading) =>
      request(instance.get(`internal/scripts`), setLoading),
    components: (setLoading) =>
      request(instance.get(`internal/components`), setLoading),
    appParameterDocument: ({ parameterName }, setLoading) =>
      request(
        instance.get(`internal/parameter-document?name=${parameterName}`),
        setLoading
      ),

    checklistReferences: (setLoading) =>
      request(instance.get(`checklist/references`), setLoading),
    checklistRegions: (id, setLoading) =>
      request(instance.get(`checklist/regions/${id}`), setLoading),
    checklistSchemas: (setLoading) =>
      request(instance.get(`checklist/schemas`), setLoading),

    filesList: ({ params, stationId }, setLoading) =>
      request(instance.get(`files/${stationId}/list`, { params }), setLoading),
    filesListNgnix: ({ params }, setLoading) =>
      request(instance.get(`files/list-nginx`, { params }), setLoading),
    filesListMongo: ({ params }, setLoading) =>
      request(instance.get(`files/list-mongo`, { params }), setLoading),
    folderListMongo: ({ params }, setLoading) =>
      request(instance.get(`files/folder-list-mongo`, { params }), setLoading),
    folderListImages: ({ params }, setLoading) =>
      request(instance.get(`files/list-images`, { params }), setLoading),
    tasks: ({ queryOBJ, stationId, status }, setLoading) =>
      request(
        instance.get(`tasks/${stationId}?status=${status}&query=${queryOBJ}`),
        setLoading
      ),
    scriptDocument: ({ name }, setLoading) =>
      request(instance.get(`internal/script-document/${name}`), setLoading),

    queriesPipelineDocument: ({ name }, setLoading) =>
      request(instance.get(`internal/queries-pipeline/${name}`), setLoading),

    queriesPipeline: (setLoading) =>
      request(instance.get(`internal/queries-pipeline`), setLoading),

    downloadAllScripts: (setLoading) =>
      request(instance.get(`internal/scripts/download`), setLoading),
    downloadAllComponents: (setLoading) =>
      request(instance.get(`internal/components/download`), setLoading),

    componentDocument: ({ name }, setLoading) =>
      request(instance.get(`internal/component-document/${name}`), setLoading),
    componentData: ({ component, query, stationId }, setLoading) =>
      request(
        instance.get(
          `components/${stationId}/${component}?data=${query}&time=${new Date().toISOString()}`
        ),

        setLoading
      ),
  },
  put: {
    batchPause: ({ stationId, batchId }, setLoading) =>
      request(instance.put(`batch/${stationId}/${batchId}/pause`), setLoading),
    batchResume: ({ stationId, batchId }, setLoading) =>
      request(instance.put(`batch/${stationId}/${batchId}/resume`), setLoading),
    batchStop: ({ stationId, batchId }, setLoading) =>
      request(instance.put(`batch/${stationId}/${batchId}/stop`), setLoading),

    activeDataset: ({ status, datasetId }, setLoading) =>
      request(
        instance.put(`internal/active-dataset`, { status, datasetId }),
        setLoading
      ),
    activeLanguage: ({ status, languageId }, setLoading) =>
      request(
        instance.put(`internal/active-language`, { status, languageId }),
        setLoading
      ),
    defaultLanguage: ({ languageId }, setLoading) =>
      request(
        instance.put(`internal/default-language`, { languageId }),
        setLoading
      ),

    userRole: ({ username, newRole }, setLoading) =>
      request(
        instance.put(`auth/user/role`, { username, newRole }),
        setLoading
      ),
    resetPassword: ({ username, newPassword }, setLoading) =>
      request(
        instance.put(`auth/user/reset-password`, { username, newPassword }),
        setLoading
      ),

    role: ({ roleName, description, types, oldRoleName }, setLoading) =>
      request(
        instance.put(`auth/role`, {
          roleName,
          description,
          types,
          oldRoleName,
        }),
        setLoading
      ),

    saveQuery: (
      { collectionName, searchMethod, queryName, query },
      setLoading
    ) =>
      request(
        instance.put(`queries/save-query`, {
          collectionName,
          searchMethod,
          queryName,
          query,
        }),
        setLoading
      ),

    checklistReference: ({ _id, reference }, setLoading) =>
      request(
        instance.put(`checklist/reference`, { _id, reference }),
        setLoading
      ),

    referenceToSchema: ({ referenceName, referenceType }, setLoading) =>
      request(
        instance.put(`checklist/reference-to-schema`, {
          referenceName,
          referenceType,
        }),
        setLoading
      ),

    station: ({ stationId, stationName, parms, edges }, setLoading) =>
      request(
        instance.put(`station/${stationId}`, {
          label: stationName,
          parms,
          edges,
        }),
        setLoading
      ),

    appParameterDocument: ({ document }, setLoading) =>
      request(
        instance.put(`internal/parameter-document`, { document }),
        setLoading
      ),

    feedbackSerial: ({ stationId, serialId, regionName }, setLoading) =>
      request(
        instance.put(`serial/${stationId}/${serialId}/feedback/`, {
          regionName,
        }),
        setLoading
      ),
    feedbackOtherImages: ({ info, stationId, serialId }, setLoading) =>
      request(
        instance.put(`serial/${stationId}/${serialId}/feedback/other-images`, {
          ...info,
        }),
        setLoading
      ),

    script: ({ document }, setLoading) =>
      request(instance.put(`internal/script`, { document }), setLoading),
    scriptName: ({ name, oldName }, setLoading) =>
      request(instance.put(`internal/script/${oldName}`, { name }), setLoading),

    component: ({ document }, setLoading) =>
      request(instance.put(`internal/component`, { document }), setLoading),
    componentName: ({ name, oldName }, setLoading) =>
      request(
        instance.put(`internal/component/${oldName}`, { name }),
        setLoading
      ),

    queryPipelinesName: ({ name, oldName }, setLoading) =>
      request(
        instance.put(`internal/queries-pipeline/${oldName}`, { name }),
        setLoading
      ),

    queryPipelines: ({ document }, setLoading) =>
      request(
        instance.put(`internal/queries-pipeline`, { document }),
        setLoading
      ),
  },
  delete: {
    user: ({ username }, setLoading) =>
      request(instance.delete(`auth/user`, { data: { username } }), setLoading),
    delete: ({ stationId, alertId }, setLoading) =>
      request(instance.delete(`alerts/${stationId}/${alertId}`), setLoading),
    role: ({ roleName }, setLoading) =>
      request(instance.delete(`auth/role`, { data: { roleName } }), setLoading),
    alert: ({ stationId, alertId }, setLoading) =>
      request(instance.delete(`alerts/${stationId}/${alertId}`), setLoading),
    query: ({ queryName }, setLoading) =>
      request(
        instance.delete(`queries/remove-query`, { data: { queryName } }),
        setLoading
      ),

    script: ({ name }, setLoading) =>
      request(instance.delete(`internal/script/${name}`), setLoading),
    component: ({ name }, setLoading) =>
      request(instance.delete(`internal/component/${name}`), setLoading),
    queryPipelines: ({ name }, setLoading) =>
      request(instance.delete(`internal/queries-pipeline/${name}`), setLoading),
  },
};

export default API;
