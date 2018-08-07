 // Framework libraries.
 import * as React from 'react';
 import * as ReactRedux from 'react-redux';

import SelectInput from '../inputs/select_input';
import {SearchTableContainer as SearchTable} from './search_table';
import Pager from '../general/pager';

import {selectSearchCache} from '../../selectors/search_cache';
import {selectModelNames} from '../../selectors/magma_selector';
import {
  cacheSearchPage,
  setSearchPageSize,
  setSearchPage
} from '../../actions/search_actions';
import {
  requestTSV,
  requestModels,
  requestDocuments
} from '../../actions/magma_actions';

export class Search extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      mode: 'search',
      page_size: 10
    };
  }

  getPage(page, newSearch=false){
    if(!this.pageCached(page) || newSearch){
      this.props.requestDocuments({
        model_name: this.state.selected_model,
        record_names: 'all',
        attribute_names: 'all',
        filter: this.state.current_filter,
        page,
        page_size: this.state.page_size,
        collapse_tables: true,
        exchange_name: `request-${this.state.selected_model}`,
        success: this.makePageCache.bind(
          this,
          page,
          newSearch ? this.state.page_size : null
        )
      })
    }
    this.props.setSearchPage(page);
  }

  pageCached(page){
    return this.props.page_cache.isCached(page.toString());
  }

  componentDidMount(){
    this.props.requestModels();
  }

  makePageCache(page, page_size, payload){
    let model = payload.models[this.state.selected_model];
    if(model.count) this.setState({ results: model.count });
    if(page_size) this.props.setSearchPageSize(page_size);
    this.props.cacheSearchPage(
      page,
      this.state.selected_model,
      Object.keys(model.documents),
      page == 1
    );
  }

  renderQuery(){

    let table_sel_props = {
      name: 'model',
      values: this.props.model_names,
      onChange: (model_name)=>{
        this.setState({selected_model: model_name});
      },
      showNone: 'enabled'
    };

    let page_size_props = {
      values: [10, 25, 50, 200],
      defaultValue: this.state.page_size,
      onChange: (page_size)=>{
        this.setState({page_size});
      },
      showNone: 'disabled'
    };

    let input_filter_props = {
      type: 'text',
      className: 'search-table-filter-input',
      placeholder: 'filter query',
      onChange: (e)=>{
        this.setState({current_filter: e.target.value});
      }
    };

    let search_btn_props = {
      className: 'pager-filter-btn',
      value: 'Search',
      disabled: !this.state.selected_model,
      onClick: ()=>{
        this.getPage(1, true);
      }
    };

    let dwnld_btn_props = {
      className: 'pager-export-btn',
      disabled: !this.state.selected_model,
      onClick: ()=>{
        this.props.requestTSV(
          this.state.selected_model,
          this.state.current_filter
        );
      }
    };

    return(
      <div className='search-table-query-group'>

        <span className='label'>Show table</span>
        <SelectInput {...table_sel_props} />
        &nbsp;&nbsp;
        <span className='label'>Page size</span>
        <SelectInput {...page_size_props} />
        &nbsp;&nbsp;
        <input {...input_filter_props} />
        <button {...search_btn_props} >

          <span className='fas fa-search'></span>
          &nbsp;{'SEARCH'}
        </button>
        <button {...dwnld_btn_props} >

          <span className='fas fa-download'></span>
          &nbsp;{'DOWNLOAD'}
        </button>
      </div>
    );
  }

  render(){
    if(this.state.mode != 'search') return null;

    let pages = null;
    let page_elems = null;
    let table_docs = null;

    if(this.props.model_name){
      pages = Math.ceil(this.state.results / this.props.page_size);
      page_elems = (
        <div className='search-table-page-group'>

          <div className='search-table-summary'>

            Found
            <span> {this.state.results} </span>
            records in table
            <span> {this.props.model_name} </span>
          </div>
          &nbsp;&nbsp;
          <Pager pages={pages} current_page={this.props.current_page} setPage={this.getPage.bind(this)} />
        </div>
      );

      table_docs = (
        <div className='search-table-container'>

          <SearchTable mode={this.state.mode} model_name={this.props.model_name} record_names={this.props.record_names } />
        </div>
      );
    }

    return(
      <div id='search-group'>

        <div className='control'>

          {this.renderQuery()}
          {page_elems}
        </div>
        {table_docs}
      </div>
    );
  }
}

const mapStateToProps = (state = {}, own_props)=>{
  let cache = selectSearchCache(state);
  return {
    model_names: selectModelNames(state, APP_CONFIG.project_name),
    page_cache: cache,
    current_page: cache.current_page,
    page_size: cache.page_size,
    model_name: cache.model_name,
    record_names: cache.record_names
  };
};

const mapDispatchToProps = (dispatch, own_props)=>{
  return {
    requestModels: ()=>{
      dispatch(requestModels());
    },

    cacheSearchPage: (page, selected_model, document_keys, page_number)=>{
      dispatch(cacheSearchPage(
        page,
        selected_model,
        document_keys,
        page_number
      ));
    },

    setSearchPage: (page)=>{
      dispatch(setSearchPage(page));
    },

    setSearchPageSize: (page_size)=>{
      dispatch(setSearchPageSize(page_size));
    },

    requestDocuments: (args)=>{
      dispatch(requestDocuments(args));
    },

    requestTSV: (model_name, filter, record_names)=>{
      dispatch(requestTSV(model_name, filter, record_names));
    }
  };
};

export const SearchContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(Search);
