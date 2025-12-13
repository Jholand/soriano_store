<?php

namespace App\Console\Commands;

use App\Models\Product;
use Illuminate\Console\Command;

class MarkExpiredProductsInactive extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'products:mark-expired-inactive';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Mark expired products as inactive';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $count = Product::expired()->where('is_active', true)->update(['is_active' => false]);
        
        $this->info("Marked {$count} expired products as inactive.");
        
        return Command::SUCCESS;
    }
}
