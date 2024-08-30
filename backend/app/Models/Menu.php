<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model as Eloquent;

class Menu extends Eloquent {
    use \Illuminate\Database\Eloquent\SoftDeletes;
    
    protected $table = 'menu';
    
    protected $fillable = [
        'parent_id',
        'title',
        'depth',
        'status'
    ];

    
}
