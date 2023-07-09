// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';

import {
  CallAdapterLocator,
  CallAdapterState,
  useAzureCommunicationCallAdapter,
  CommonCallAdapter,
  CallAdapter,
  toFlatCommunicationIdentifier,
} from '@azure/communication-react';

import React, { useCallback, useMemo, useRef, useEffect, useState, createContext, useContext } from 'react';
import { createAutoRefreshingCredential } from '../utils/credential';
import { WEB_APP_TITLE } from '../utils/AppUtils';
import { CallCompositeContainer } from './CallCompositeContainer';

import { VideoTile, FluentThemeProvider } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { stampStyleLeft, stampStyleRight, stampStyleUp, stampStyleVibration } from '../styles/Stamp.styles';

export interface CallScreenProps {
  token: string;
  userId: CommunicationUserIdentifier;

  callLocator: CallAdapterLocator;
  displayName: string;
}

const FaceContext = createContext({
  faceType: 'normal',
  changeFaceType: (n: string) => { }
});

const ItoStampContext = createContext({
  itoStampF: false,
  changeItoStampF: (f: boolean) => { }
});

const ShiroishiStampContext = createContext({
  shiroishiStampF: false,
  changeShiroishiStampF: (f: boolean) => { }
});

const ShinoharaStampContext = createContext({
  shinoharaStampF: false,
  changeShinoharaStampF: (f: boolean) => { }
});

const MiyamuraStampContext = createContext({
  miyamuraStampF: false,
  changeMiyamuraStampF: (f: boolean) => { }
});

export const CallScreen = (props: CallScreenProps): JSX.Element => {
  const { token, userId } = props;
  const callIdRef = useRef<string>();
  const pressInterval = 10;

  const [faceType, setFaceType] = useState<string>('normal');
  const [itoStampF, setItoStampF] = useState<boolean>(false);
  const [shiroishiStampF, setShiroishiStampF] = useState<boolean>(false);
  const [shinoharaStampF, setShinoharaStampF] = useState<boolean>(false);
  const [miyamuraStampF, setMiyamuraStampF] = useState<boolean>(false);

  const changeFaceType = (s: string): void => {
    setFaceType(s);
  };

  const changeItoStampF = (f: boolean): void => {
    setItoStampF(f);
  };
  const changeShiroishiStampF = (f: boolean): void => {
    setShiroishiStampF(f);
  };
  const changeShinoharaStampF = (f: boolean): void => {
    setShinoharaStampF(f);
  };
  const changeMiyamuraStampF = (f: boolean): void => {
    setMiyamuraStampF(f);
  };

  // Key Down

  const keyFunction = useCallback((event) => {
    switch (event.keyCode) {
      // A
      case 65:
        setTimeout(() => {
          changeFaceType('negative');
        }, pressInterval);

        break;
      // S
      case 83:
        setTimeout(() => {
          changeFaceType('normal');
          console.log(faceType);
        }, pressInterval);
        break;
      // D
      case 68:
        setTimeout(() => {
          changeFaceType('positive');
        }, pressInterval);
        break;
      // F
      case 70:
        setTimeout(() => {
          changeItoStampF(true);
          console.log(itoStampF);
        }, pressInterval);
        break;
      // R
      case 82:
        setTimeout(() => {
          changeItoStampF(false);
          console.log(itoStampF);
        }, pressInterval);
        break;
      // G
      case 71:
        setTimeout(() => {
          changeShinoharaStampF(true);
        }, pressInterval);
        break;
      // T
      case 84:
        setTimeout(() => {
          changeShinoharaStampF(false);
        }, pressInterval);
        break;
      // H
      case 72:
        setTimeout(() => {
          changeShiroishiStampF(true);
        }, pressInterval);
        break;
      // Y
      case 89:
        setTimeout(() => {
          changeShiroishiStampF(false);
        }, pressInterval);
        break;
      // J
      case 74:
        setTimeout(() => {
          changeMiyamuraStampF(true);
        }, pressInterval);
        break;
      // U
      case 85:
        setTimeout(() => {
          changeMiyamuraStampF(false);
        }, pressInterval);
        break;


    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", keyFunction, false);
    return () => {
      document.removeEventListener("keydown", keyFunction, false);
    }
  }, [keyFunction]);


  // Azure
  const subscribeAdapterEvents = useCallback((adapter: CommonCallAdapter) => {
    adapter.on('error', (e) => {
      // Error is already acted upon by the Call composite, but the surrounding application could
      // add top-level error handling logic here (e.g. reporting telemetry).
      console.log('Adapter error event:', e);
    });
    adapter.onStateChange((state: CallAdapterState) => {
      const pageTitle = convertPageStateToString(state);
      document.title = `${pageTitle} - ${WEB_APP_TITLE}`;

      if (state?.call?.id && callIdRef.current !== state?.call?.id) {
        callIdRef.current = state?.call?.id;
        console.log(`Call Id: ${callIdRef.current}`);
      }
    });
  }, []);

  const afterCallAdapterCreate = useCallback(
    async (adapter: CallAdapter): Promise<CallAdapter> => {
      subscribeAdapterEvents(adapter);
      return adapter;
    },
    [subscribeAdapterEvents]
  );

  const credential = useMemo(() => {
    return createAutoRefreshingCredential(toFlatCommunicationIdentifier(userId), token);
  }, [token, userId]);

  return (
    <MiyamuraStampContext.Provider value={{ miyamuraStampF, changeMiyamuraStampF }}>
      <ShiroishiStampContext.Provider value={{ shiroishiStampF, changeShiroishiStampF }}>
        <ShinoharaStampContext.Provider value={{ shinoharaStampF, changeShinoharaStampF }}>
          <ItoStampContext.Provider value={{ itoStampF, changeItoStampF }}>
            <FaceContext.Provider value={{ faceType, changeFaceType }}>
              <AzureCommunicationCallScreen afterCreate={afterCallAdapterCreate} credential={credential} {...props} />
            </FaceContext.Provider>
          </ItoStampContext.Provider>
        </ShinoharaStampContext.Provider>
      </ShiroishiStampContext.Provider>
    </MiyamuraStampContext.Provider>
  );
};

type AzureCommunicationCallScreenProps = CallScreenProps & {
  afterCreate?: (adapter: CallAdapter) => Promise<CallAdapter>;
  credential: AzureCommunicationTokenCredential;
};

const AzureCommunicationCallScreen = (props: AzureCommunicationCallScreenProps): JSX.Element => {
  const { afterCreate, callLocator: locator, userId, ...adapterArgs } = props;

  if (!('communicationUserId' in userId)) {
    throw new Error('A MicrosoftTeamsUserIdentifier must be provided for Teams Identity Call.');
  }

  const adapter = useAzureCommunicationCallAdapter(
    {
      ...adapterArgs,
      userId,
      locator
    },
    afterCreate
  );

  // 伊藤切り替え
  const onRenderPlaceholder_Ito = () => {
    switch (useContext(FaceContext).faceType) {
      case 'normal':
        return (
          <Stack>
            <img
              src="https://i.imgur.com/sJ0Fm5N.png"
              style={{
                borderRadius: '170px',
                width: '170px',
                position: 'absolute',
                margin: 'auto',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
              }}
            />
          </Stack>
        );
      case 'positive':
        return (
          <Stack>
            <img
              src="https://i.imgur.com/dpBrZGX.png"
              style={{
                borderRadius: '170px',
                width: '170px',
                position: 'absolute',
                margin: 'auto',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
              }}
            />
          </Stack>
        );

      case 'negative':
        return (
          <Stack>
            <img
              src="https://i.imgur.com/nZsd3vM.png"
              style={{
                borderRadius: '170px',
                width: '170px',
                position: 'absolute',
                margin: 'auto',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
              }}
            />
          </Stack>
        );
      default:
        return (
          <Stack>
            <img
              src="https://i.imgur.com/sJ0Fm5N.png"
              style={{
                borderRadius: '170px',
                width: '170px',
                position: 'absolute',
                margin: 'auto',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
              }}
            />
          </Stack>
        );

    }

  }

  // 城石切り替え
  const onRenderPlaceholder_Shiroishi = () => {
    switch (useContext(FaceContext).faceType) {
      case 'normal':
        return (
          <Stack>
            <img
              src="https://i.imgur.com/oXyrTui.png"
              style={{
                borderRadius: '170px',
                width: '170px',
                position: 'absolute',
                margin: 'auto',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
              }}
            />
          </Stack>
        );
      case 'positive':
        return (
          <Stack>
            <img
              src="https://i.imgur.com/V7AV0k4.png"
              style={{
                borderRadius: '170px',
                width: '170px',
                position: 'absolute',
                margin: 'auto',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
              }}
            />
          </Stack>
        );

      case 'negative':
        return (
          <Stack>
            <img
              src="https://i.imgur.com/E4wzzid.png"
              style={{
                borderRadius: '170px',
                width: '170px',
                position: 'absolute',
                margin: 'auto',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
              }}
            />
          </Stack>
        );
      default:
        return (
          <Stack>
            <img
              src="https://i.imgur.com/oXyrTui.png"
              style={{
                borderRadius: '170px',
                width: '170px',
                position: 'absolute',
                margin: 'auto',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
              }}
            />
          </Stack>
        );

    }

  }

  // 篠原切り替え
  const onRenderPlaceholder_Shinohara = () => {
    switch (useContext(FaceContext).faceType) {
      case 'normal':
        return (
          <Stack>
            <img
              src="https://i.imgur.com/wNCKJJS.png"
              style={{
                borderRadius: '170px',
                width: '170px',
                position: 'absolute',
                margin: 'auto',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
              }}
            />
          </Stack>
        );
      case 'positive':
        return (
          <Stack>
            <img
              src="https://i.imgur.com/YzbpWfN.png"
              style={{
                borderRadius: '170px',
                width: '170px',
                position: 'absolute',
                margin: 'auto',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
              }}
            />
          </Stack>
        );

      case 'negative':
        return (
          <Stack>
            <img
              src="https://i.imgur.com/1Jk2eib.png"
              style={{
                borderRadius: '170px',
                width: '170px',
                position: 'absolute',
                margin: 'auto',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
              }}
            />
          </Stack>
        );
      default:
        return (
          <Stack>
            <img
              src="https://i.imgur.com/wNCKJJS.png"
              style={{
                borderRadius: '170px',
                width: '170px',
                position: 'absolute',
                margin: 'auto',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
              }}
            />
          </Stack>
        );

    }

  }



  // 宮村切り替え
  const onRenderPlaceholder_Miyamura = () => {
    switch (useContext(FaceContext).faceType) {
      case 'normal':
        return (
          <Stack>
            <img
              src="https://i.imgur.com/bY1wqNC.png"
              style={{
                borderRadius: '170px',
                width: '170px',
                position: 'absolute',
                margin: 'auto',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
              }}
            />
          </Stack>
        );
      case 'positive':
        return (
          <Stack>
            <img
              src="https://i.imgur.com/VYO6ij3.png"
              style={{
                borderRadius: '170px',
                width: '170px',
                position: 'absolute',
                margin: 'auto',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
              }}
            />
          </Stack>
        );

      case 'negative':
        return (
          <Stack>
            <img
              src="https://i.imgur.com/Vezm74Y.png"
              style={{
                borderRadius: '170px',
                width: '170px',
                position: 'absolute',
                margin: 'auto',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
              }}
            />
          </Stack>
        );
      default:
        return (
          <Stack>
            <img
              src="https://i.imgur.com/bY1wqNC.png"
              style={{
                borderRadius: '170px',
                width: '170px',
                position: 'absolute',
                margin: 'auto',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
              }}
            />
          </Stack>
        );

    }
  }

  const ItoStamp = () => {
    if (useContext(ItoStampContext).itoStampF) {
      return (<div><img src="https://i.imgur.com/KZILTky.png" style={{
        height: '200px', width: '200px'
      }}
      className={stampStyleUp}
      /></div>);
    } else {
      return (<div></div>);
    }
  }

  const ShinoharaStamp = () => {
    if (useContext(ShinoharaStampContext).shinoharaStampF) {
      return (<div><img src="https://i.imgur.com/9IaSKbt.png" style={{
        height: '200px', width: '200px'
      }}
      className={stampStyleVibration}
      /></div>);
    } else {
      return (<div></div>);
    }
  }

  const ShiroishiStamp = () => {
    if (useContext(ShiroishiStampContext).shiroishiStampF) {
      return (<div><img src="https://i.imgur.com/EbOS6Fs.png" style={{
        height: '200px', width: '200px'
      }}
      // className={stampStyleLeft}
      /></div>);
    } else {
      return (<div></div>);
    }
  }

  const MiyamuraStamp = () => {
    if (useContext(MiyamuraStampContext).miyamuraStampF) {
      return (<div><img src="https://i.imgur.com/KZILTky.png" style={{
        height: '200px', width: '200px'
      }}
      className={stampStyleUp}
      /></div>);
    } else {
      return (<div></div>);
    }
  }

  // const videoTileStyles = { root: { height: '300px', width: '400px', border: '1px solid #999' } };
  const videoTileStyles = { root: { height: '205px', width: '500px', border: '1px solid #999' } };

  return (
    <>
      <CallCompositeContainer {...props} adapter={adapter} />
      <FluentThemeProvider>

        <div style={{ marginTop: '0px', display: 'flex', alignItems: 'center' }}>
          <VideoTile
            userId="UserIdPlaceholder"
            styles={videoTileStyles}
            displayName={'Iさん'}
            renderElement={null}
            isMirrored={true}
            onRenderPlaceholder={onRenderPlaceholder_Ito}
          />
          <ItoStamp />

          {/* <img src="https://i.imgur.com/KZILTky.png" style={{
            height: '200px', width: '200px'
          }} /> */}
          {/* <img src="https://i.imgur.com/9IaSKbt.png" style={{
        height: '200px', width: '200px'
      }} /> */}
          {/* <img src="https://i.imgur.com/EbOS6Fs.png" style={{
        height: '200px', width: '200px'
      }} /> */}
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <VideoTile
            userId="UserIdPlaceholder"
            styles={videoTileStyles}
            displayName={'Sさん'}
            renderElement={null}
            isMirrored={true}
            onRenderPlaceholder={onRenderPlaceholder_Shinohara}
          />

          <ShinoharaStamp />

          {/* <img src="https://i.imgur.com/KZILTky.png" style={{
        height: '200px', width: '200px'
      }} /> */}

          {/* <img src="https://i.imgur.com/9IaSKbt.png" style={{
            height: '200px', width: '200px'
          }} /> */}
          {/* <img src="https://i.imgur.com/EbOS6Fs.png" style={{
        height: '200px', width: '200px'
      }} /> */}
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <VideoTile
            userId="UserIdPlaceholder"
            styles={videoTileStyles}
            displayName={'Sさん'}
            renderElement={null}
            isMirrored={true}
            onRenderPlaceholder={onRenderPlaceholder_Shiroishi}
          />

          <ShiroishiStamp />

          {/* <img src="https://i.imgur.com/KZILTky.png" style={{
        height: '200px', width: '200px'
      }} /> */}
          {/* <img src="https://i.imgur.com/9IaSKbt.png" style={{
        height: '200px', width: '200px'
      }} /> */}
          {/* <img src="https://i.imgur.com/EbOS6Fs.png" style={{
            height: '200px', width: '200px'
          }} /> */}
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <VideoTile
            userId="UserIdPlaceholder"
            styles={videoTileStyles}
            displayName={'Mさん'}
            renderElement={null}
            isMirrored={true}
            onRenderPlaceholder={onRenderPlaceholder_Miyamura}
          />

          <MiyamuraStamp />

          {/* <img src="https://i.imgur.com/KZILTky.png" style={{
            height: '200px', width: '200px'
          }} /> */}
          {/* <img src="https://i.imgur.com/9IaSKbt.png" style={{
        height: '200px', width: '200px'
      }} /> */}
          {/* <img src="https://i.imgur.com/EbOS6Fs.png" style={{
        height: '200px', width: '200px'
      }} /> */}
        </div>

      </FluentThemeProvider>
    </>
  )
};

const convertPageStateToString = (state: CallAdapterState): string => {
  switch (state.page) {
    case 'accessDeniedTeamsMeeting':
      return 'error';
    case 'leftCall':
      return 'end call';
    case 'removedFromCall':
      return 'end call';
    default:
      return `${state.page}`;
  }
};