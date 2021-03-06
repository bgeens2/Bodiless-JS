/**
 * Copyright © 2019 Johnson & Johnson
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint-disable no-alert */
import React, { FC } from 'react';
import {
  contextMenuForm, getUI, ContextProvider, TMenuOption,
} from '@bodiless/core';
import { AxiosPromise } from 'axios';
import BackendClient from './BackendClient';
import CommitsList from './CommitsList';

const backendFilePath = process.env.BODILESS_BACKEND_DATA_FILE_PATH || '';
const backendStaticPath = process.env.BODILESS_BACKEND_STATIC_PATH || '';
/**
 * DefinePlugin env var.
 *
 * All env vars are stringified by the Webpack DefinePlugin.
 * https://webpack.js.org/plugins/define-plugin/#usageGatsby.
 *
 * DefinePlugin is used by Gatsby to source env vars.
 * https://www.gatsbyjs.org/docs/environment-variables/#example.
 */
const canCommit = (process.env.BODILESS_BACKEND_COMMIT_ENABLED || '0') === '1';

type Client = {
  commit: (
    message: string,
    directories: string[],
    paths: string[],
    files: string[]
  ) => AxiosPromise<any>,
  getLatestCommits: () => AxiosPromise<any>,
  pull: () => AxiosPromise<any>,
  reset: () => AxiosPromise<any>,
};

type Props = {
  client?: Client,
};

const handle = (promise: AxiosPromise<any>) => promise
  .then(res => {
    if (res.status === 200) {
      // @TODO: Display the response in a component instead of an alert.
      // eslint-disable-next-line no-undef
      alert('Operation successful.');
    } else {
      // eslint-disable-next-line no-undef
      alert('An unknown error has occured.');
    }
  })
  .catch(err => {
    // Use back-end crafted error message if available.
    if (err.response && err.response.data) {
      // eslint-disable-next-line no-undef
      alert(err.response.data);
    } else {
      // eslint-disable-next-line no-undef
      alert(err.message);
    }
  });

const formGetCommitsList = (client: Client) => contextMenuForm({
  // @todo: handle what happens when user selects a commit from the loaded list.
  submitValues: () => {},
})(
  ({ ui }: any) => {
    const { ComponentFormTitle } = getUI(ui);
    return (
      <>
        <ComponentFormTitle>Latest Commits</ComponentFormTitle>
        <CommitsList client={client} />
      </>
    );
  },
);

const formGitCommit = (client: Client) => contextMenuForm({
  submitValues: (submitValues: any) => handle(client.commit(submitValues.commitMessage,
    [backendFilePath, backendStaticPath], [], [])),
})(
  ({ ui }: any) => {
    const { ComponentFormTitle, ComponentFormLabel, ComponentFormText } = getUI(ui);
    return (
      <>
        <ComponentFormTitle>Upload Changes</ComponentFormTitle>
        <ComponentFormLabel htmlFor="commit-txt">
          Description:
        </ComponentFormLabel>
        <ComponentFormText field="commitMessage" id="commit-txt" />
      </>
    );
  },
);

const formGitPull = (client: Client) => contextMenuForm({
  submitValues: () => handle(client.pull()),
})(
  ({ ui }: any) => {
    const { ComponentFormTitle, ComponentFormLabel } = getUI(ui);
    return (
      <>
        <ComponentFormTitle>Download Changes</ComponentFormTitle>
        <ComponentFormLabel htmlFor="pull-txt">
          Download remote changes
        </ComponentFormLabel>
      </>
    );
  },
);

const formGitReset = (client: Client) => contextMenuForm({
  submitValues: () => handle(client.reset()),
})(
  ({ ui }: any) => {
    const { ComponentFormTitle, ComponentFormLabel } = getUI(ui);
    return (
      <>
        <ComponentFormTitle>Revert to saved</ComponentFormTitle>
        <ComponentFormLabel htmlFor="reset-txt">
          Discard local changes
        </ComponentFormLabel>
      </>
    );
  },
);

const defaultClient = new BackendClient();

const getMenuOptions = (client: Client = defaultClient): TMenuOption[] => {
  const saveChanges = canCommit ? formGitCommit(client) : undefined;
  return [
    {
      name: 'listCommits',
      icon: 'list',
      handler: () => formGetCommitsList(client),
    },
    {
      name: 'savechanges',
      icon: 'cloud_upload',
      isDisabled: () => !canCommit,
      handler: () => saveChanges,
    },
    {
      name: 'pullchanges',
      icon: 'cloud_download',
      handler: () => formGitPull(client),
    },
    {
      name: 'resetchanges',
      icon: 'first_page',
      handler: () => formGitReset(client),
    },
  ];
};

const GitProvider: FC<Props> = ({ children, client }) => (
  <ContextProvider
    getMenuOptions={() => getMenuOptions(client)}
    name="Git"
  >
    {children}
  </ContextProvider>
);

export default GitProvider;
