// Fixtures for data mocking.
import {
  model_documents,
  revisions,
  document_response,
  model_template,
  hunter_template
} from '../fixtures/magma_fixture.js';

// Actions to test.
import {
  selectModels,
  selectModelDocuments,
  selectModelRevisions,
  selectModelRevision,
  selectModelNames,
  selectModelTemplates,
  selectModelTemplate
} from '../../../lib/client/jsx/selectors/magma_selector';

const PROJECT_NAME = 'etna';
const state = {
  magma: {
    [PROJECT_NAME]: document_response
  }
};

describe('magma selector', ()=>{
  it('Selects models from the store by project name.', ()=>{
    let models = selectModels(state, PROJECT_NAME);
    let expected_value = document_response.models;
    expect(models).toEqual(expected_value);
  });

  it('Selects documents of a model from the store by record names.', ()=>{

    let documents = selectModelDocuments(
      state,
      PROJECT_NAME,
      'monster',
      ['Caledonian Boar', 'Nemean Lion']
    );

    let expected_value = {
      'Caledonian Boar': model_documents['Caledonian Boar'],
      'Nemean Lion': model_documents['Nemean Lion']
    };

    expect(documents).toEqual(expected_value);
  });

  it('Selects the all revisions of a model type.', ()=>{
    let revisions = selectModelRevisions(state, PROJECT_NAME, 'monster');
    let expected_value = document_response.models.monster.revisions;
    expect(revisions).toEqual(expected_value);
  });

  it('Selects a revision of a model type by record name/id.', ()=>{

    let revision = selectModelRevision(
      state,
      PROJECT_NAME,
      'monster',
      'Nemean Lion'
    );

    let expected_value = revisions['Nemean Lion'];

    expect(revision).toEqual(expected_value);
  });

  it('Selects all the model names from a project.', ()=>{
    let model_names = selectModelNames(state, PROJECT_NAME);
    let expected_value = ['hunter', 'monster'];
    expect(model_names).toEqual(expected_value);
  });

  it('Selects the templates from all the models for a project.', ()=>{
    let templates = selectModelTemplates(state, PROJECT_NAME);

    let expected_value = [
      model_template,
      hunter_template
    ];

    expect(templates).toEqual(expected_value);
  });

  it('Selects the template of a model.', ()=>{
    let template = selectModelTemplate(state, PROJECT_NAME, 'hunter');
    let expected_value = hunter_template;
    expect(template).toEqual(expected_value);
  });
});
