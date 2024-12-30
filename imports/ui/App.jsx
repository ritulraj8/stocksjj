import { Meteor } from 'meteor/meteor';
import React, { Fragment } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Sidebar } from './sidebar.jsx';
import { LoginPage } from './LoginPage.jsx';
import { LoginForm } from './LoginForm.jsx';

export const App = () => {
  const user = useTracker(() => Meteor.user());

  return (
    <BrowserRouter>
      <div className="main">
        {user ? (
          <Fragment>
            <Routes>
              <Route path="/" element={<Sidebar />} />
              <Route path="/loginpage" element={<LoginPage />} />
            </Routes>
          </Fragment>
        ) : (
          <LoginForm />
        )}
      </div>
    </BrowserRouter>
  );
};





