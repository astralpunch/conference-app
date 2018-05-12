import React from 'react';
import styled from 'styled-components';

const ErrorField = props => {
  const {
    input,
    type,
    meta: { error, touched },
  } = props;

  const errorText = touched && error && <div style={{ color: 'red' }}>{error}</div>;

  return (
    <Wrapper>
      <Input {...props} {...input} type={type} />
      <ErrorText>{errorText}</ErrorText>
    </Wrapper>
  );
};

export default ErrorField;

const ErrorText = styled.div`
  position: absolute;
  top: 5px;
  left: 375px;
  width: 200px;
`;

const Wrapper = styled.div`
  position: relative;
`;

const Input = styled.input`
  display: block;
  font-size: 20px;
  width: 350px;
  height: 35px;
  text-align: center;
  margin-bottom: 15px;
  margin-right: 5px;
`;
