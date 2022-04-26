import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import * as CodeMirror from 'codemirror';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/sql-hint';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/comment-fold';
import 'codemirror/addon/fold/indent-fold';


import * as ace from 'ace-builds';
import 'ace-builds/src-noconflict/mode-sqlserver';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/theme-chrome'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('editor') editor: any;

  ngAfterViewInit() {
    this.initCodeMirror();
  }

  initAceEditor() {
    const e = ace.edit(this.editor.nativeElement, {
      mode: 'ace/mode/sqlserver',
      enableAutoIndent: true,
      theme: 'chrome',
      highlightActiveLine: true
    });

    e.setOptions({
      enableBasicAutocompletion: true,
      enableSnippets: true,
      enableLiveAutocompletion: true
    });

    e.completers.push({
      getCompletions: function(editor, session, pos, prefix, callback) {
          const completions: any[] = [];
          // we can use session and pos here to decide what we are going to show
          ["word1", "word2"].forEach(function(w) {
              completions.push({
                  value: w,
                  meta: "my completion",
              });
          });
          
          callback(null, completions);
      }
  })
  }

  initCodeMirror() {
    const editor = CodeMirror(this.editor.nativeElement, {
      value: 'select * from table',
      mode: 'sql',
      lineNumbers: true,
      showHint: true,
      lineWrapping: true,
      foldGutter: true,
      styleActiveLine: true,
      gutters: ["breakpoints", "CodeMirror-linenumbers", "CodeMirror-foldgutter"]
    });

    CodeMirror.commands.autocomplete = function(cm) {
      CodeMirror.showHint(cm, CodeMirror.hint.sql, {
          tables: {
              "table1": [ "col_A", "col_B", "col_C" ],
              "table2": [ "other_columns1", "other_columns2" ]
          },
      } );
    }

    editor.on("keyup", function (cm, event) {
      if (!cm.state.completionActive && event.key != 'Enter' && event.key != 'Backspace') {
         CodeMirror.commands.autocomplete(cm, undefined, { completeSingle: false })
      }
  });
  }
}
