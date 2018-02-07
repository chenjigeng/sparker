import { Loading } from './Loading';
import React from 'react';
import ReactDom from 'react-dom';

const body = document.body;
let el = null;


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
    console.log('hide');
    if (el) {
      el.style.display = 'none';
    }
  }
};

