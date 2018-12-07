export const nestDataset = (records, key, parent_key)=>{

  /*
   * Set the children object on each record if not present, and isolate the root
   * objects.
   */
  let nodes = [];
  for(let id in records){
    if(!('children' in records[id])) records[id]['children'] = [];
    if(records[id][parent_key] == null) nodes.push(records[id]);
  }

  while(nodes.length > 0){
    let node = nodes.pop();

    for(let id in records){

      /*
       * Match the current child's 'parent_key' with the current node's key. Add
       * the child to the nodes array to keep the match making active. Remove
       * the the child from the records object.
       */
      if(node[key] == records[id][parent_key] && key in node){
        records[node[key]].children.push(records[id]);
        nodes.push(records[id]);
      }
    }
  }

  for(let id in records){
    if(records[id][parent_key] != null) delete records[id];
  }

  return records;
}

export const setDefinitionUids = (records, dictionary, uid_obj = {})=>{

  // Loop each record that we have.
  loop_a:
  for(let rec_uid in records){
    if(!(rec_uid in uid_obj)) uid_obj[rec_uid] = {};

    uid_obj[rec_uid] = {
      ...uid_obj[rec_uid],
      uid: rec_uid,
      children: [],
      definitions: [],
      definition: null,
      siblings: [],
      parent_uid: records[rec_uid].parent_uid
    };

    let parent_def_id = null;

    // Loop each definition looking for a matching record value.
    loop_b:
    for(let def_uid_b in dictionary.definitions){

      let def_b = dictionary.definitions[def_uid_b];

      if(records[rec_uid].name == def_b.name){
        parent_def_id = def_b.parent_uid;

        if(records[rec_uid].value == def_b.value){

          parent_def_id = def_b.parent_uid;
          break loop_b;
        }
      }
    }

    /*
     * Loop each definition again looking for other possible definitions and
     * siblings.
     */
    loop_c:
    for(let def_uid_c in dictionary.definitions){

      let def_c = dictionary.definitions[def_uid_c];

      if(records[rec_uid].name == def_c.name){
        uid_obj[rec_uid].definitions.push(def_uid_c);
      }

      if(parent_def_id == def_c.parent_uid){
        uid_obj[rec_uid].siblings.push(def_uid_c);
      }
    }

    /*
     * On a new record, this will automatically set the key fields with a
     * single definition.
     */
    if(uid_obj[rec_uid].definitions.length == 1){
      uid_obj[rec_uid]['definition'] = uid_obj[rec_uid].definitions[0];
    }
  }

  return uid_obj;
};

export const excludeCheckboxFields = (records)=>{
  for(let id in records){
    let rec = records[id];
    if(rec.type == 'checkbox'){
      delete records[id];
    }
  }
  return records;
};

export const flattenDataSet = (object)=>{
  let data_obj = {
    [object['name']]: object['value']
  };

  let child_obj = {};
  if('children' in object){
    for(let uid in object['children']){
      child_obj = flattenDataSet(object['children'][uid]);
      data_obj = Object.assign(data_obj, child_obj);
    }
  }

  return data_obj;
};
