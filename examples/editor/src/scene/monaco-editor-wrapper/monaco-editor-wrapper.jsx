'use strict';
import React, {Component} from 'react';
import {Select, Radio} from 'antd';
const Option = Select.Option;
const _ = require('lodash');
import MonacoEditor from 'react-monaco-editor';
import DragTargetWrapper from './drag-target-wrapper';

class MonacoEditorWarpper extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.instance = null;
  }

  editorWillMount(monaco) {
    monaco.editor.defineTheme('myTheme', {
      base: 'vs',
      inherit: true,
      rules: [{ background: 'F7F7F7' }],
      colors: {
        'editorGutter.background': '#f7f7f7',
        'editor.foreground': '#000000',
        'editor.background': '#FFF',
        'editorCursor.foreground': '#8B0000',
        'editor.lineHighlightBackground': '#DDD',
        'editorLineNumber.foreground': '#008800',
        'editor.selectionBackground': '#88000030',
        'editor.inactiveSelectionBackground': '#88000015'
      }
    });
  }

  onDragAddTag(dragSource, dragType) {
    let setText = (value) => {
      let position = this.instance.getPosition();
      if (!_.isEmpty(position)) {
        this.instance.executeEdits(this.props.code, [{
          range: {startLineNumber: position.lineNumber, startColumn: position.column, endLineNumber: position.lineNumber, endColumn: position.column},
          text: value
        }]);
      } else {
        let code = _.cloneDeep(this.props.code);
        code = code + value;
        this.props.editCode(code);
      }
    };
    if (dragType === 'entity') {
      let entityText = dragSource.meta.entityCode;
      setText(entityText);
    } else if (dragType === 'func') {
      let funcText = dragSource.meta.name + '(' + ')';
      setText(funcText);
    } else if (dragType === 'tag') {
      let tagText =  dragSource.meta.entityCode + '.' + dragSource.meta.tagCode;
      setText(tagText);
    }
  }

  onChange(newValue) {
    this.props.editCode(newValue);
  }

  render() {
    const options = {
      selectOnLineNumbers: true,
      automaticLayout: true,
      dragAndDrop: true,
      readOnly: this.props.isReadOnly
    };
    return (
      <div className="tag-factory-codemirror">
        <div className="content-ctx">
          <div className="codemirror-form">
            <div className="search-tag">
              <label className="search-machine">查询编辑器</label>
            </div>
            <div className="form-ctx">
              <label className="search-type">查询类型</label>
              <Radio.Group
                value={this.props.searchType}
                onChange={this.props.changeType}
              >
                <Radio value="2">TQL</Radio>
                <Radio value="1">JSON</Radio>
              </Radio.Group>
              <label className="search-type">选择样例</label>
              <Select placeholder="简单查询" className="choose-select" onSelect={(value) => {this.props.editCode(value);}}>
                <Option value='select User.age from User where User.gender = ${gender, string, "good"}'>s01</Option>
                <Option value='select User.age, Order.time from User join Order where time > ${start_time,string,"20080808"} and time < ${end_time,string,"20080908"}'>s02</Option>
                <Option value='select User.age, Film.type from User left join Film on (User.likeFilm = Film.id) where user.age > ${start_age,number,20} and user.age < ${end_age,number,100}'>s03</Option>
              </Select>
            </div>
          </div>
          <div className="factory-codemirror">
            {/* <DragTargetWrapper
              className='codemirror-drag-wrapper'
              dropCb={this.onDragAddTag.bind(this)}
            > */}
              <MonacoEditor
                width="100%"
                height="100%"
                language='mysql'
                theme="myTheme"
                value={this.props.code}
                options={options}
                onChange={this.onChange.bind(this)}
                editorDidMount={(editor) => { this.instance = editor; editor.focus();}}
                editorWillMount={this.editorWillMount}
              />
            {/* </DragTargetWrapper> */}
          </div>
        </div>
      </div>
    );
  }
}
export default MonacoEditorWarpper;
