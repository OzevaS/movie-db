import { Alert, Spin } from 'antd';
import React from 'react';

interface WrapperDataProps {
  promise: Promise<any> | null;
}

interface WrapperDataState {
  data: any[] | null;
  isError: boolean;
  isLoading: boolean;
}

const withData = (View: any) => {
  return class Wrapper extends React.Component<WrapperDataProps, WrapperDataState> {
    state = {
      data: null,
      isLoading: false,
      isError: false,
    };

    componentDidMount() {
      const { promise } = this.props;

      if (promise) this.loadData(promise);
    }

    componentDidUpdate({ promise: prevPromise }: WrapperDataProps) {
      const { promise } = this.props;

      if (promise && promise !== prevPromise) this.loadData(promise);
    }

    loadData = (promise: Promise<any>) => {
      this.setState({
        isLoading: true,
        isError: false,
      });

      promise
        .then((data) => {
          this.onDataLoaded(data);
        })
        .catch(() => {
          this.onError();
        });
    };

    onDataLoaded = (data: any[]) => {
      this.setState({
        data,
        isLoading: false,
      });
    };

    onError = () => {
      this.setState({
        isError: true,
        isLoading: false,
      });
    };

    render() {
      const { data, isLoading, isError } = this.state;

      const hasData = !isLoading && !isError && data;

      return (
        <>
          {isLoading && <Spin size="large" />}
          {isError && <Alert message="Error" description="Failed to load. Please try again." type="error" showIcon />}
          {hasData && <View data={data} {...this.props} />}
        </>
      );
    }
  };
};

export default withData;
