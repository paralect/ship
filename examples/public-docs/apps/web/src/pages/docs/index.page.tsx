import React from 'react';
// @ts-ignore
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

import { NextPage } from 'next';
import { docApi } from 'resources/doc';
import { Center, Loader } from '@mantine/core';

const Docs: NextPage = () => {
  const { data, isLoading } = docApi.useGetDocsJson();

  if (isLoading) {
    return <Center h="100vh" mx="auto"><Loader size={48} /></Center>;
  }

  return (
    <SwaggerUI spec={{
      ...data,
      openapi: '3.0.1', // this is workaround since newer versions are not supported yet
    }}
    />
  );
};

export default Docs;
