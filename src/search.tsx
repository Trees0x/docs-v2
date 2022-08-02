/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
import cn from 'classnames';
import matchSorter from 'match-sorter';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

const Item = ({ title, active, href, onMouseOver, search }) => {
    const highlight = title.toLowerCase().indexOf(search.toLowerCase());

    return (
        <Link href={href}>
            <a
                className="block no-underline"
                onMouseOver={onMouseOver}
                onFocus={onMouseOver}
            >
                <li className={cn('p-2', { active })}>
                    {title.slice(0, Math.max(0, highlight))}
                    <span className="highlight">
                        {title.slice(highlight, highlight + search.length)}
                    </span>
                    {title.slice(Math.max(0, highlight + search.length))}
                </li>
            </a>
        </Link>
    );
};

const UP = true;
const DOWN = false;

const Search = ({ directories = [] }) => {
    const router = useRouter();

    const [show, setShow] = useState(false);
    const [search, setSearch] = useState('');
    const [active, setActive] = useState(0);

    const input = useRef(null);

    const results = useMemo(() => {
        if (!search) return [];

        // Will need to scrape all the headers from each page and search through them here
        // (similar to what we already do to render the hash links in sidebar)
        // We could also try to search the entire string text from each page
        // @ts-ignore
        return matchSorter(directories, search, { keys: ['title'] });
    }, [search]);

    const moveActiveItem = (up) => {
        const position = active + (up ? -1 : 1);

        const { length } = results;

        // Modulo instead of remainder,
        // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Remainder
        const next = (position + length) % length;

        setActive(next);
    };

    const handleKeyDown = useCallback(
        (event) => {
            const { key, ctrlKey } = event;

            if ((ctrlKey && key === 'n') || key === 'ArrowDown') {
                event.preventDefault();
                moveActiveItem(DOWN);
            }

            if ((ctrlKey && key === 'p') || key === 'ArrowUp') {
                event.preventDefault();
                moveActiveItem(UP);
            }

            if (key === 'Enter') {
                router.push(results[active].route);
            }
        },
        [active, results, router]
    );

    useEffect(() => {
        setActive(0);
    }, [search]);

    useEffect(() => {
        const inputs = new Set(['input', 'select', 'button', 'textarea']);

        const down = (event) => {
            if (
                document.activeElement &&
                !inputs.has(document.activeElement.tagName.toLowerCase())
            ) {
                if (event.key === '/') {
                    event.preventDefault();
                    input.current.focus();
                } else if (event.key === 'Escape') {
                    setShow(false);
                }
            }
        };

        window.addEventListener('keydown', down);

        return () => window.removeEventListener('keydown', down);
    }, []);

    const renderList = show && results.length > 0;

    return (
        <div className="nextra-search relative w-full md:w-64">
            {renderList && (
                <div
                    className="search-overlay z-10"
                    onClick={() => setShow(false)}
                />
            )}
            <input
                onChange={(event) => {
                    setSearch(event.target.value);
                    setShow(true);
                }}
                className="appearance-none border rounded py-2 px-3 leading-tight focus:outline-none focus:ring w-full"
                type="search"
                placeholder='Search ("/" to focus)'
                onKeyDown={handleKeyDown}
                onFocus={() => setShow(true)}
                ref={input}
            />
            {renderList && (
                <ul className="shadow-md list-none p-0 m-0 absolute left-0 md:right-0 rounded mt-1 border top-100 divide-y z-20 w-full md:w-auto">
                    {results.map((response, index) => {
                        return (
                            <Item
                                key={`search-item-${index}`}
                                title={response.title}
                                href={response.route}
                                active={index === active}
                                search={search}
                                onMouseOver={() => setActive(index)}
                            />
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default Search;
