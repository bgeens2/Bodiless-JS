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

import React, { FC, HTMLProps } from 'react';
import {
  H2, Section, addClasses, stylable,
} from '@bodiless/fclasses';
import { withNode } from '@bodiless/core';
import { flow } from 'lodash';
import { withTerm, withTitle, withDisplayName } from '@bodiless/layouts';
import { FlexboxGrid } from '@bodiless/layouts-ui';

import CaptionedImage from './CaptionedImage';

const asGalleryTile = addClasses('mx-2 border-8');

const withBlueBorder = addClasses('border-blue-400');
const withGreenBorder = addClasses('border-green-400');
const withRedBorder = addClasses('border-red-400');

const BlueImageTile = flow(
  asGalleryTile,
  withBlueBorder,
  withTerm('Color')('Blue'),
  withDisplayName('BlueImageTile'),
  withTitle('Blue Image Tile'),
)(CaptionedImage);

const GreenImageTile = flow(
  asGalleryTile,
  withGreenBorder,
  withTerm('Color')('Green'),
  withTerm('Type')('Image'),
  withDisplayName('GreenImageTile'),
  withTitle('Green Image Tile'),
)(CaptionedImage);

const RedImageTile = flow(
  stylable,
  asGalleryTile,
  withRedBorder,
  withTerm('Color')('Red'),
  withDisplayName('RedImageTile'),
  withTitle('Red Image Tile'),
)(CaptionedImage);

const Wrapper = addClasses('my-2')(Section);
const Header = addClasses('text-2xl')(H2);
const Body: FC = () => (
  <FlexboxGrid nodeKey="body" componentTypes={{ RedImageTile, BlueImageTile, GreenImageTile }} />
);

const Gallery: FC<HTMLProps<HTMLDivElement>> = ({ children, ...rest }) => (
  <Wrapper {...rest}>
    <Header>Gallery</Header>
    <Body />
  </Wrapper>
);

export const GalleryTile = asGalleryTile(CaptionedImage);
export default withNode(stylable(Gallery));