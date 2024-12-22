
import { createAction, createSlice, } from "@reduxjs/toolkit";
import { ApiResponse, IReview } from "@refineit/types";
import { AppState } from "../store";

interface IReviewState {
    loading: boolean;
    reviews: IReview[];
    pagination: IPagination
}

interface IPagination {
    current_page: number;
    per_page: number;
    total_pages: number;
    total_items: number;
    navigation: ApiResponse.INavigation;
}

const initialState: IReviewState = {
    loading: true,
    reviews: [],
    pagination: {
        current_page: 0,
        navigation: {current: "", next: "", previous: ""},
        per_page: 10,
        total_items: 0,
        total_pages: 0
    }
};

export const reviewslice = createSlice({
    name: "review",
    initialState,
    reducers: {
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setPagination(state, action) {
            state.pagination = action.payload;
        },
        setReviews(state, action) {
            state.reviews = action.payload;
        },
        pushReviews(state, action) {
            state.reviews = state.reviews.concat(action.payload);
        },
    }
});

export const reviewActions = {
    loadReviewsDispatch: createAction(`${reviewslice.name}/set-reviews`, (payload) => ({ payload })),
    loadReviewsPaginatedDispatch: createAction(`${reviewslice.name}/load-reviews-paginated`, (payload) => ({ payload })),
    pushReviewsDispatch: createAction(`${reviewslice.name}/add-review`, (payload) => ({ payload })),
    deleteReviewDispatch: createAction(`${reviewslice.name}/delete-review`, (payload) => ({ payload })),
    updateReviewDispatch: createAction(`${reviewslice.name}/update-review`, (payload) => ({ payload })),
    
    setLoading: reviewslice.actions.setLoading,
    setPagination: reviewslice.actions.setPagination,
    setReviews: reviewslice.actions.setReviews,
    pushReviews: reviewslice.actions.pushReviews,
};

export const getters = {
    loading: (state: AppState) => state.review.loading,
    reviews: (state: AppState) => state.review.reviews,
    pagination: (state: AppState) => state.review.pagination,
};

export const reviewReducer = reviewslice.reducer;
