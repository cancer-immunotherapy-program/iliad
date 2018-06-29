export const monster_documents = {
  'Caledonian Boar': {
    created_at: '2018-05-12T03:00:28+00:00',
    updated_at: '2018-05-12T03:00:28+00:00',
    labor: null,
    name: 'Caledonian Boar',
    species: 'pig',
    victim: [

    ]
  },
  'Lernean Hydra': {
    created_at: '2018-05-12T03:00:28+00:00',
    updated_at: '2018-05-12T03:00:28+00:00',
    labor: null,
    name: 'Lernean Hydra',
    species: 'hydra',
    victim: [

    ]
  },
  'Nemean Lion': {
    created_at: '2018-05-12T03:00:28+00:00',
    updated_at: '2018-05-12T03:00:28+00:00',
    labor: null,
    name: 'Nemean Lion',
    species: 'lion',
    victim: [

    ]
  }
};

export const monster_revisions = {
  'Caledonian Boar': {
    name: 'Aetolian Boar',
    victim: [
      'farmer'
    ]
  },
  'Nemean Lion': {
    labor: 1
  }
};

export const monster_template = {
  name: 'monster',
  identifier: 'name',
  parent: 'labor',

  attributes: {
    created_at: {
      name: 'created_at',
      type: 'DateTime',
      attribute_class: 'Magma::Attribute',
      display_name: 'Created At',
      shown: false
    },
    updated_at: {
      name: 'updated_at',
      type: 'DateTime',
      attribute_class: 'Magma::Attribute',
      display_name: 'Updated At',
      shown: false
    },
    labor: {
      name: 'labor',
      model_name: 'labor',
      attribute_class: 'Magma::ForeignKeyAttribute',
      display_name: 'Labor',
      shown: true
    },
    name: {
      name: 'name',
      type: 'String',
      attribute_class: 'Magma::Attribute',
      display_name: 'Name',
      shown: true
    },
    species: {
      name: 'species',
      type: 'String',
      attribute_class: 'Magma::Attribute',
      display_name: 'Species',
      match: '^[a-z\\s]+$',
      shown: true
    },
    victim: {
      name: 'victim',
      model_name: 'victim',
      attribute_class: 'Magma::CollectionAttribute',
      display_name: 'Victim',
      shown: true
    }
  }
};

export const hunter_documents = {
  'Echion': {
    created_at: '2018-05-12T03:00:28+00:00',
    updated_at: '2018-05-12T03:00:28+00:00',
    name: 'Echion',
    notes: `one of the Argonauts, son of Mercurius (Hermes) and Antianeira 
(daughter of Menoetius), brother of Erytusson`
  },

  'Theseus': {
    created_at: '2018-05-12T03:00:28+00:00',
    updated_at: '2018-05-12T03:00:28+00:00',
    name: 'Theseus',
    notes: `faced another dangerous chthonic creature, the dusky wild 
Crommyonian Sow, on a separate occasion`
  },

  'Jason': {
    created_at: '2018-05-12T03:00:28+00:00',
    updated_at: '2018-05-12T03:00:28+00:00',
    name: 'Jason',
    notes: 'Aeson’s son, from Iolkos'
  }
};

export const hunter_template = {
  name: 'hunter',
  identifier: 'name',
  parent: 'labor',

  attributes: {
    created_at: {
      name: 'created_at',
      type: 'DateTime',
      attribute_class: 'Magma::Attribute',
      display_name: 'Created At',
      shown: false
    },
    updated_at: {
      name: 'updated_at',
      type: 'DateTime',
      attribute_class: 'Magma::Attribute',
      display_name: 'Updated At',
      shown: false
    },
    name: {
      name: 'name',
      type: 'String',
      attribute_class: 'Magma::Attribute',
      display_name: 'Name',
      shown: true
    },
    notes: {
      name: 'name',
      type: 'String',
      attribute_class: 'Magma::Attribute',
      display_name: 'Notes',
      shown: true
    }
  }
};

export const revision_response = {
  models: {
    monster: {
      documents: monster_documents,
      template: monster_template
    }
  }
};

export const document_response = {
  models: {
    monster: {
      documents: monster_documents,
      revisions: monster_revisions,
      template: monster_template,
    },
    hunter: {
      documents: hunter_documents,
      template: hunter_template
    }
  }
};
