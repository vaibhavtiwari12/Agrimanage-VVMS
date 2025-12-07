import React, { Component } from 'react';
import { Result, Button } from 'antd';
import AnimatedSadFace from './AnimatedSadFace.svg';

class Errorboundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
    };
  }
  componentDidCatch(error, errorInfo) {
    console.log('Error Occured', error, errorInfo);
  }
  render() {
    // Use animated SVG as image
    const animatedSadFace = <img src={AnimatedSadFace} alt="Sad face" width={64} height={64} />;
    if (this.state.hasError)
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60vh',
          }}
        >
          <Result
            status="error"
            icon={animatedSadFace}
            title="Something went wrong."
            subTitle="An unexpected error occurred. Please try again or return to the homepage."
            extra={[
              <Button type="primary" href="/" key="home">
                Go to Homepage
              </Button>,
            ]}
          />
        </div>
      );
    else {
      return this.props.children;
    }
  }
}

export default Errorboundary;
