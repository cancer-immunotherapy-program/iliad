export const manifest_data = {
  manifests: [
    {
      id:8,
      name:'manifest1',
      description:'private manifest',
      project:'labors',
      access:'private',
      md5sum: 'ea6cf4ec34f3df8fe58b16671f00a017',
      script: "@record_name = '1021'",
      updated_at:'2017-09-18T23:58:11.048Z',
      user:'Eurystheus',
      is_editable:true
    },
    {
      id:9,
      name:'manifest2',
      description:'public manifest',
      project:'labors',
      access:'public',
      md5sum: 'ea6cf4ec34f3df8fe58b16671f00a017',
      script: "@record_name = '1022'",
      updated_at:'2017-09-18T23:58:50.495Z',
      user: 'Eurystheus',
      is_editable:true
    },
  ]
};

export const new_manifest_request = {
  id: 0,
  name: 'New Manifest',
  access: 'private',
  description: 'A new manifest.',
  script: "@record_name='testing123'"
};

export const new_manifest_response = Object.assign({}, new_manifest_request, {
  id: 100,
  is_editable: true,
  md5sum: 'ea6cf4ec34f3df8fe58b16671f00a017',
  project: 'some_project',
  updated_at: '2018-06-27T15:28:39-07:00',
  user: 'Some User'
});
