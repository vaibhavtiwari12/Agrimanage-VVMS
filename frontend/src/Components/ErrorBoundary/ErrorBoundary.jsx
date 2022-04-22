import React, { Component } from 'react';

class Errorboundary extends Component {
    constructor(props){
        super(props);
        this.state = {
            hasError: false
        }
    }
    static getDerivedStateFromError(error) {
        return {
            hasError: true,
        }
    }
    componentDidCatch(error, errorInfo) {
        console.log("Error Occured", error, errorInfo)
    }
    render() {
        if(this.state.hasError)
        return (
            <div className='text-center m-5'>
                <h2 className='text-danger'>Somthing Really Wrong Happened.</h2>
                <h5>
                    <a href='/'>Go To HomePage</a>
                </h5>
            </div>
        );else {
            return this.props.children;
        }
    }
}

export default Errorboundary;
