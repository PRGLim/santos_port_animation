export class Terminal{
  terminal_id: number
  terminal_name: string
  terminal_market: string

  constructor(
    terminal_id: number,
    terminal_name: string,
    terminal_market: string,
  )
  {
    this.terminal_id = terminal_id
    this.terminal_name = terminal_name
    this.terminal_market = terminal_market
  }
}
