import { Alert, Spin } from 'antd';

import { IDataState } from '../../../types';

const withStateData = (View: any) => {
  return function Wrapper(props: IDataState) {
    const { data, error, loading } = props;

    const hasData = !error && !loading && data;

    return (
      <>
        {loading && <Spin size="large" />}
        {error && <Alert message="Error" description="Failed to load. Please try again." type="error" showIcon />}
        {hasData && <View data={data} />}
      </>
    );
  };
};

export default withStateData;
