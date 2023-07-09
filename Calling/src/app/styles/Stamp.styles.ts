// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles } from '@fluentui/react';

export const stampStyleUp = mergeStyles({
  transform: 'translateX(10px)',
  animationName: 'up',
  animationDuration: '1.5s',
});

export const stampStyleLeft = mergeStyles({
  transform: 'translateX(10px)',
  animationName: 'left',
  animationDuration: '1.5s',
});

export const stampStyleRight = mergeStyles({
  transform: 'translateX(10px)',
  animationName: 'right',
  animationDuration: '1.5s',
});

export const stampStyleVibration = mergeStyles({
  transform: 'translateX(10px)',
  animationName: 'vib',
  animationDuration: '1.5s',
});

// CSSファイルやstyleタグ内で@keyframesルールを定義する
const keyframes = `
  @keyframes up {
    0% {
      transform: translateX(0px);
    }
    100% {
      transform: translateY(-200px);
    }
  }

  @keyframes left {
    0% {
      transform: translateX(0px);
    }
    100% {
      transform: translateX(-500px);
    }
  }

  @keyframes right {
    0% {
      transform: translateX(0px);
    }
    100% {
      transform: translateX(500px);
    }
  }

  @keyframes vib {
    0% {transform: translate(0px, 0px) rotateZ(0deg)}
    10% {transform: translate(20px, 20px) rotateZ(10deg)}
    20% {transform: translate(0px, 2px) rotateZ(0deg)}
    30% {transform: translate(20px, 20px) rotateZ(-10deg)}
    40% {transform: translate(0px, 2px) rotateZ(0deg)}
    50% {transform: translate(20px, 20px) rotateZ(10deg)}
    60% {transform: translate(0px, 2px) rotateZ(0deg)}
    70% {transform: translate(20px, 20px) rotateZ(-10deg)}
    80% {transform: translate(0px, 2px) rotateZ(0deg)}
    90% {transform: translate(20px, 20px) rotateZ(10deg)}
    100% {transform: translate(0px, 0px) rotateZ(0deg)}
}
`;

const styleTag = document.createElement('style');
styleTag.innerHTML = keyframes;
document.head.appendChild(styleTag);
