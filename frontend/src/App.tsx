import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import HowIBuiltThis from "./pages/notes/HowIBuiltThis.tsx";
import Home from "./pages/Home.tsx";
import PageNotFound from "./pages/PageNotFound.tsx";
import RegisterPage from "./pages/auth/RegisterPage.tsx";
import LoginPage from "./pages/auth/LoginPage.tsx";
import Dashboard from "./pages/admin/Dashboard.tsx";
import BookEdit from "./pages/admin/books/BookEdit.tsx";
import BookEditOne from "./pages/admin/books/BookEditOne.tsx";
import AuthorList from "./pages/admin/authors/AuthorList.tsx";
import BookCreate from "./pages/admin/books/BookCreate.tsx";
import AuthorEdit from "./pages/admin/authors/AuthorEdit.tsx";
import AuthorEditOne from "./pages/admin/authors/AuthorEditOne.tsx";
import UserList from "./pages/admin/users/UserList.tsx";
import UserEditOne from "./pages/admin/users/UserEditOne.tsx";
import MainPage from "./pages/users/MainPage.tsx";
import ListAllBooks from "./pages/users/book/ListAllBooks.tsx";
import ShowSpecificBook from "./pages/users/book/ShowSpecificBook.tsx";
import ListAllAuthors from "./pages/users/authors/ListAllAuthors.tsx";
import ShowSpecificAuthor from "./pages/users/authors/ShowSpecificAuthor.tsx";
import PlaylistMain from "./pages/users/playlists/PlaylistMain.tsx";
import PlaylistEditSpecific from "./pages/users/playlists/PlaylistEditSpecific.tsx";
import ShowProfile from "./pages/users/profile/ShowProfile.tsx";
import ChangePassword from "./pages/users/profile/ChangePassword.tsx";
import ChattingRoom from "./pages/chatbot/ChattingRoom.tsx";
import SearchResults from "./pages/users/SearchResults.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main route*/}
        <Route path="/" element={<Home />} />

        {/*Ai route*/}
        <Route path="/chatbot" element={<ChattingRoom />} />

        {/* Profile routes*/}
        <Route path="/profile" element={<ShowProfile />} />
        <Route path="/profile/change-password" element={<ChangePassword />} />
        <Route path="/search" element={<SearchResults />} />

        {/* Auth routes*/}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* User playlist routes */}
        <Route path="/playlists" element={<PlaylistMain />} />
        <Route path="/playlists/:id" element={<PlaylistEditSpecific />} />

        {/* User book routes */}
        <Route path="/books" element={<ListAllBooks />} />
        <Route path="/books/:id" element={<ShowSpecificBook />} />

        {/* User authors routes */}
        <Route path="/authors" element={<ListAllAuthors />} />
        <Route path="/authors/:id" element={<ShowSpecificAuthor />} />

        {/* Notes */}
        <Route path="/HowIBuiltThis" element={<HowIBuiltThis />} />

        {/* Admin book routes */}
        <Route path="/admin/books/new" element={<BookCreate />} />
        <Route path="/admin/books/:id/edit" element={<BookEditOne />} />
        <Route path="/admin/books" element={<BookEdit />} />

        {/* Admin author routes */}
        <Route path="/admin/authors" element={<AuthorList />} />
        <Route path="/admin/authors/new" element={<AuthorEdit />} />
        <Route path="/admin/authors/:id/edit" element={<AuthorEditOne />} />

        {/* Admin users routes */}
        <Route path="/admin/users" element={<UserList />} />
        <Route path="/admin/users/:id/edit" element={<UserEditOne />} />

        {/* Admin dashboard route */}
        <Route path="/admin/dashboard" element={<Dashboard />} />

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
