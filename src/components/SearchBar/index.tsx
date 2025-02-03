const SearchBar = () => {
    return (
        <div className="h-[44px] flex bg-grey10 dark:bg-darkContrast border border-grey40 dark:border-mediumDarkContrast rounded-full flex-1">
            <label className="flex items-center justify-center pl-4" htmlFor="search">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.3913 10.6957C18.3913 14.9458 14.9459 18.3913 10.6957 18.3913C6.44546 18.3913 3 14.9458 3 10.6957C3 6.44546 6.44546 3 10.6957 3C14.9459 3 18.3913 6.44546 18.3913 10.6957Z" stroke="#464C4F" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M16.2929 16.2929C16.6834 15.9024 17.3166 15.9024 17.7071 16.2929L21.7071 20.2929C22.0976 20.6834 22.0976 21.3166 21.7071 21.7071C21.3166 22.0976 20.6834 22.0976 20.2929 21.7071L16.2929 17.7071C15.9024 17.3166 15.9024 16.6834 16.2929 16.2929Z" fill="#464C4F"></path>
                </svg>
            </label>
            <input
                id="search"
                type="search"
                placeholder="Search tokens"
                className="w-full h-full outline-none appearance-none dark:text-white bg-transparent text-sm placeholder:leading-none pb-0.5 pl-3 pr-5"
            />
        </div>
    );
}

export default SearchBar