// Fixtures for data mocking.
import {
  monster_documents,
  monster_template,
  hunter_documents,
  hunter_template
} from '../fixtures/magma_fixture.js';

// Actions proxied for testing.
import {
  addTemplate,
  addDocuments,
  addPredicates,
  reviseDocument,
  discardRevision
} from '../../../lib/client/jsx/actions/magma_actions';

// The reducer to test.
import magmaReducer from '../../../lib/client/jsx/reducers/magma_reducer';

describe('manifest selector', ()=>{

  let project_name = 'labors';

  const initial_magma_state = {
    labors: {
      models: {
        monster: {
          documents: monster_documents,
          template: monster_template
        }
      }
    }
  };

  it('should return the inital state', ()=>{
    expect(magmaReducer(undefined, {})).toEqual({});
  });

  it('should handle action ADD_TEMPLATE', ()=>{
    let action = addTemplate(hunter_template, project_name);
    let final_state = magmaReducer(
      initial_magma_state,
      action
    );

    let expected_state = initial_magma_state;
    expected_state.labors.models['hunter'] = {
      documents: {},
      revisions: {},
      template: hunter_template
    };

    expect(final_state).toEqual(expected_state);
  });

  it('should handle action ADD_DOCUMENTS', ()=>{
    let action = addDocuments('hunter', hunter_documents, project_name);
    let final_state = magmaReducer(
      initial_magma_state,
      action
    );

    let expected_state = initial_magma_state;
    expected_state.labors.models['hunter'] = {
      documents: hunter_documents,
      revisions: {},
      template: hunter_template
    };

    expect(final_state).toEqual(expected_state);
  });

  it('should handle actions REVISE_DOCUMENTS', ()=>{
    let action = reviseDocument(
      monster_documents['Nemean Lion'],
      monster_template,
      monster_template.attributes.labor,
      1,
      project_name
    );

    let final_state = magmaReducer(
      initial_magma_state,
      action
    );

    let expected_state = initial_magma_state;
    expected_state.labors.models['monster'] = {
      documents: monster_documents,
      revisions: {
        'Nemean Lion': {
          labor: 1
        }
      },
      template: monster_template
    };

    expect(final_state).toEqual(expected_state);
  });

  it('should handle action DISCARD_REVISION', ()=>{
    let action = discardRevision(
      'Nemean Lion',
      'monster',
      project_name
    );

    let final_state = magmaReducer(
      initial_magma_state,
      action
    );

    let expected_state = initial_magma_state;
    delete expected_state.labors.models.monster.revisions['Nemean Lion'];

    expect(final_state).toEqual(expected_state);
  });
});
