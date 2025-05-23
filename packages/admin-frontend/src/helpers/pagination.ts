export class Pagination {
  #count: number;
  #offset: number;
  #limit: number;
  #nextToRender: number;
  constructor(
    count: number,
    offset: number,
    limit: number,
    nextToRender: number
  ) {
    this.#count = count;
    this.#offset = offset;
    this.#limit = limit;
    // nextToRender is used to decide how many page links to show ahead
    this.#nextToRender = nextToRender;
  }
  clone() {
    return new Pagination(
      this.#count,
      this.offset,
      this.limit,
      this.#nextToRender
    );
  }
  setPage(pageNumber: number) {
    if (pageNumber < 1 || pageNumber > this.totalPages) {
      throw new Error("Page number out of range");
    }
    this.#offset = (pageNumber - 1) * this.#limit;
  }
  get count() {
    return this.#count;
  }
  get offset() {
    return this.#offset;
  }
  get limit() {
    return this.#limit;
  }

  get currentOffset() {
    return this.#offset;
  }
  get totalPages() {
    return Math.ceil(this.#count / this.#limit);
  }

  get currentPage() {
    return Math.floor(this.#offset / this.#limit) + 1;
  }

  get hasNextPage() {
    return this.currentPage < this.totalPages;
  }

  get hasPreviousPage() {
    return this.currentPage > 1;
  }
  get currentPageItems() {
    return this.#limit;
  }
  get startItem() {
    return this.#offset + 1;
  }
  get endItem() {
    return Math.min(this.#offset + this.#limit, this.#count);
  }
  get pageInfo() {
    return {
      totalItems: this.#count,
      currentPage: this.currentPage,
      totalPages: this.totalPages,
      hasNextPage: this.hasNextPage,
      hasPreviousPage: this.hasPreviousPage,
      startItem: this.startItem,
      endItem: this.endItem,
    };
  }
  nextPage() {
    if (this.hasNextPage) {
      this.#offset += this.#limit;
    }
  }
  previousPage() {
    if (this.hasPreviousPage) {
      this.#offset -= this.#limit;
    }
  }
  renderNextPages() {
    // We'll build an array of "pages" to render.
    const pages = [];
    const total = this.totalPages;
    const current = this.currentPage;
    const nextCount = +this.#nextToRender; // convert in case it's passed as string
    let startPage, endPage;

    // Determine if current page is among the last few pages.
    // In your example total=11, nextToRender=3 so if current >= 11 - 3 = 8, then we want window [8,9,10,11]
    if (current >= total - nextCount) {
      startPage = total - nextCount;
      // Make sure the startPage isn't less than 1.
      if (startPage < 1) {
        startPage = 1;
      }
      endPage = total;
    } else {
      // Otherwise, the window starts at the current page.
      startPage = current;
      // The window end will be current + nextCount, but make sure it does not exceed total.
      endPage = current + nextCount;
      if (endPage > total) {
        endPage = total;
      }
    }

    // Always show first page
    pages.push("1");

    // Add dots if there's a gap between first page and window start
    if (startPage > 2) {
      pages.push("...");
    } else {
      // If no gap, include all intervening pages
      for (let p = 2; p < startPage; p++) {
        pages.push(p.toString());
      }
    }

    // Add pages from our computed window.
    for (let p = startPage; p <= endPage; p++) {
      // Avoid duplicate of 1 if startPage is 1 (but using our condition above, it normally isn’t)
      if (p !== 1 && p !== total) {
        pages.push(p.toString());
      }
    }

    // If window end doesn't reach the last page, add dots.
    if (endPage < total - 1) {
      pages.push("...");
    } else {
      // If gap is only one page, add the missing page.
      for (let p = endPage + 1; p < total; p++) {
        pages.push(p.toString());
      }
    }

    // Avoid duplicate of last page if already added; otherwise, always show last page.
    if (total !== 1) {
      pages.push(total.toString());
    }

    return pages;
  }
}
