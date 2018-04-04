import { Loading } from './Loading';
import React from 'react';
import ReactDom from 'react-dom';


let body = {};
let el = null;

if (process.env.BUILD_TARGET !== 'server') {
  body = document.body;
}


export const SparkLoading =  {
  show: function () {
    if (!el) {
      el = document.createElement('div');
      ReactDom.render(<Loading />, el);
      body.appendChild(el);
    }
    el.style.display = 'block';    
  },
  hide: function () {
    if (el) {
      el.style.display = 'none';
    }
  }
};

