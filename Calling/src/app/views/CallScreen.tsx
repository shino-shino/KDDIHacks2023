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

export const CallScreen = (props: CallScreenProps): JSX.Element => {
  const { token, userId } = props;
  const callIdRef = useRef<string>();
  const pressInterval = 10;

  const [faceType, setFaceType] = useState<string>('normal');

  const changeFaceType = (s: string): void => {
    setFaceType(s);
  };

  // Key Down

  const keyFunction = useCallback((event) => {
    switch (event.keyCode) {
      case 65:
        setTimeout(() => {
          console.log("A is pressed!");
          changeFaceType('normal');
        }, pressInterval);

        break;
      case 66:
        setTimeout(() => {
          console.log("B is pressed!");
          changeFaceType('positive');
        }, pressInterval);
        break;
      case 67:
        setTimeout(() => {
          console.log("C is pressed!");
          changeFaceType('negative');
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
    <FaceContext.Provider value={{ faceType, changeFaceType }}>
      <AzureCommunicationCallScreen afterCreate={afterCallAdapterCreate} credential={credential} {...props} />
    </FaceContext.Provider>
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
  // 犬gif用
  // const onRenderPlaceholder = (): JSX.Element => (
  //   <Stack>
  //     <img
  //       src="https://media.giphy.com/media/4Zo41lhzKt6iZ8xff9/giphy.gif"
  //       style={{
  //         borderRadius: '150px',
  //         width: '150px',
  //         position: 'absolute',
  //         margin: 'auto',
  //         left: 0,
  //         right: 0,
  //         top: 0,
  //         bottom: 0
  //       }}
  //     />
  //   </Stack>
  // );

  // ito_negative用
  // const onRenderPlaceholder_ito_negative = (): JSX.Element => (
  //   <Stack>
  //     <img
  //       src="https://i.imgur.com/nZsd3vM.png"
  //       style={{
  //         borderRadius: '170px',
  //         width: '170px',
  //         position: 'absolute',
  //         margin: 'auto',
  //         left: 0,
  //         right: 0,
  //         top: 0,
  //         bottom: 0
  //       }}
  //     />
  //   </Stack>
  // );

  // ito_normal用
  // const onRenderPlaceholder_ito_normal = (): JSX.Element => (
  //   <Stack>
  //     <img
  //       src="https://i.imgur.com/sJ0Fm5N.png"
  //       style={{
  //         borderRadius: '170px',
  //         width: '170px',
  //         position: 'absolute',
  //         margin: 'auto',
  //         left: 0,
  //         right: 0,
  //         top: 0,
  //         bottom: 0
  //       }}
  //     />
  //   </Stack>
  // );

  // ito_positive用
  // const onRenderPlaceholder_ito_positive = (): JSX.Element => (
  //   <Stack>
  //     <img
  //       src="https://i.imgur.com/dpBrZGX.png"
  //       style={{
  //         borderRadius: '170px',
  //         width: '170px',
  //         position: 'absolute',
  //         margin: 'auto',
  //         left: 0,
  //         right: 0,
  //         top: 0,
  //         bottom: 0
  //       }}
  //     />
  //   </Stack>
  // );

  // shinohara_negative用
  // const onRenderPlaceholder_shinohara_negative = (): JSX.Element => (
  //   <Stack>
  //     <img
  //       src="https://i.imgur.com/1Jk2eib.png"
  //       style={{
  //         borderRadius: '170px',
  //         width: '170px',
  //         position: 'absolute',
  //         margin: 'auto',
  //         left: 0,
  //         right: 0,
  //         top: 0,
  //         bottom: 0
  //       }}
  //     />
  //   </Stack>
  // );

  // shinohara_normal用
  const onRenderPlaceholder_shinohara_normal = (): JSX.Element => (
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

  // shinohara_positive用
  // const onRenderPlaceholder_shinohara_positive = (): JSX.Element => (
  //   <Stack>
  //     <img
  //       src="https://i.imgur.com/YzbpWfN.png"
  //       style={{
  //         borderRadius: '170px',
  //         width: '170px',
  //         position: 'absolute',
  //         margin: 'auto',
  //         left: 0,
  //         right: 0,
  //         top: 0,
  //         bottom: 0
  //       }}
  //     />
  //   </Stack>
  // );

  // shiroishi_negative用
  // const onRenderPlaceholder_shiroishi_negative = (): JSX.Element => (
  //   <Stack>
  //     <img
  //       src="https://i.imgur.com/E4wzzid.png"
  //       style={{
  //         borderRadius: '170px',
  //         width: '170px',
  //         position: 'absolute',
  //         margin: 'auto',
  //         left: 0,
  //         right: 0,
  //         top: 0,
  //         bottom: 0
  //       }}
  //     />
  //   </Stack>
  // );

  // shiroishi_normal用
  const onRenderPlaceholder_shiroishi_normal = (): JSX.Element => (
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

  // shiroishi_positive用
  // const onRenderPlaceholder_shiroishi_positive = (): JSX.Element => (
  //   <Stack>
  //     <img
  //       src="https://i.imgur.com/V7AV0k4.png"
  //       style={{
  //         borderRadius: '170px',
  //         width: '170px',
  //         position: 'absolute',
  //         margin: 'auto',
  //         left: 0,
  //         right: 0,
  //         top: 0,
  //         bottom: 0
  //       }}
  //     />
  //   </Stack>
  // );

  // miyamura_negative用
  // const onRenderPlaceholder_miyamura_negative = (): JSX.Element => (
  //   <Stack>
  //     <img
  //       src="https://i.imgur.com/Vezm74Y.png"
  //       style={{
  //         borderRadius: '170px',
  //         width: '170px',
  //         position: 'absolute',
  //         margin: 'auto',
  //         left: 0,
  //         right: 0,
  //         top: 0,
  //         bottom: 0
  //       }}
  //     />
  //   </Stack>
  // );

  // miyamura_normal用
  const onRenderPlaceholder_miyamura_normal = (): JSX.Element => (
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

  // miyamura_positive用
  // const onRenderPlaceholder_miyamura_positive = (): JSX.Element => (
  //   <Stack>
  //     <img
  //       src="https://i.imgur.com/VYO6ij3.png"
  //       style={{
  //         borderRadius: '170px',
  //         width: '170px',
  //         position: 'absolute',
  //         margin: 'auto',
  //         left: 0,
  //         right: 0,
  //         top: 0,
  //         bottom: 0
  //       }}
  //     />
  //   </Stack>
  // );

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

          <img src="https://i.imgur.com/KZILTky.png" style={{
            height: '200px', width: '200px'
          }} />
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

          {/* <img src="https://i.imgur.com/KZILTky.png" style={{
        height: '200px', width: '200px'
      }} /> */}
          <img src="https://i.imgur.com/9IaSKbt.png" style={{
            height: '200px', width: '200px'
          }} />
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

          {/* <img src="https://i.imgur.com/KZILTky.png" style={{
        height: '200px', width: '200px'
      }} /> */}
          {/* <img src="https://i.imgur.com/9IaSKbt.png" style={{
        height: '200px', width: '200px'
      }} /> */}
          <img src="https://i.imgur.com/EbOS6Fs.png" style={{
            height: '200px', width: '200px'
          }} />
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

          <img src="https://i.imgur.com/KZILTky.png" style={{
            height: '200px', width: '200px'
          }} />
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