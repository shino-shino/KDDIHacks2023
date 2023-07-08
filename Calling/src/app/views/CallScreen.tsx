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

import React, { useCallback, useMemo, useRef } from 'react';
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

export const CallScreen = (props: CallScreenProps): JSX.Element => {
  const { token, userId } = props;
  const callIdRef = useRef<string>();

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

  return <AzureCommunicationCallScreen afterCreate={afterCallAdapterCreate} credential={credential} {...props} />;
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

  const onRenderPlaceholder = (): JSX.Element => (
    <Stack>
      <img
        src="https://media.giphy.com/media/4Zo41lhzKt6iZ8xff9/giphy.gif"
        style={{
          borderRadius: '150px',
          width: '150px',
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
  // const videoTileStyles = { root: { height: '300px', width: '400px', border: '1px solid #999' } };
  const videoTileStyles = { root: { height: '205px', width: '500px', border: '1px solid #999' } };
  const thumsup = { root: { height: '200px', width: '200px', position: 'relative', top: "50px", left: "600px" } }

  return (
    <>
      <CallCompositeContainer {...props} adapter={adapter} />
      <FluentThemeProvider>

        <div style={{ marginTop: '0px' }}>
          <VideoTile
            userId="UserIdPlaceholder"
            styles={videoTileStyles}
            displayName={'Maximus Aurelius'}
            renderElement={null}
            isMirrored={true}
            onRenderPlaceholder={onRenderPlaceholder}
          />
        </div>

        <VideoTile
          userId="UserIdPlaceholder"
          styles={videoTileStyles}
          displayName={'Maximus Aurelius'}
          renderElement={null}
          isMirrored={true}
          onRenderPlaceholder={onRenderPlaceholder}
        />
        <VideoTile
          userId="UserIdPlaceholder"
          styles={videoTileStyles}
          displayName={'Maximus Aurelius'}
          renderElement={null}
          isMirrored={true}
          onRenderPlaceholder={onRenderPlaceholder}
        />

        <VideoTile
          userId="UserIdPlaceholder"
          styles={videoTileStyles}
          displayName={'Maximus Aurelius'}
          renderElement={null}
          isMirrored={true}
          onRenderPlaceholder={onRenderPlaceholder}
        />
        <img src={`${window.location.origin}/images/thums-up.png`} style={{
          height: '200px', width: '200px', position: 'relative', top: "-400px", left: "500px"
        }} />
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
